import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Budget } from '../models/budget.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import { Transaction } from '../models/transaction.model';
import dayjs from 'dayjs';
import { Types } from 'mongoose';
import {
    createBudgetNotification,
    getNextBudgetNotificationLevel,
} from '../utils/budget';
import { logger } from '../utils/logger';

export const getBudgets = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const month = parseInt(req.query.month as string, 10);
        const year = parseInt(req.query.year as string, 10);

        if (isNaN(month) || isNaN(year)) {
            res.status(400).json({
                message: 'Parámetros month y year requeridos',
            });
            return;
        }

        const today = dayjs();
        const isCurrentMonth =
            month === today.month() + 1 && year === today.year();

        let budgets = await Budget.find({
            user: userId,
            month,
            year,
        }).populate('category');

        if (budgets.length === 0 && isCurrentMonth) {
            const prevMonth = month === 1 ? 12 : month - 1;
            const prevYear = month === 1 ? year - 1 : year;

            const prevBudgets = await Budget.find({
                user: userId,
                month: prevMonth,
                year: prevYear,
                isRecurring: true,
            });

            for (const prev of prevBudgets) {
                const startOfPrevMonth = dayjs(`${prevYear}-${prevMonth}-01`)
                    .startOf('month')
                    .toDate();
                const endOfPrevMonth = dayjs(`${prevYear}-${prevMonth}-01`)
                    .endOf('month')
                    .toDate();

                const prevTransactions = await Transaction.find({
                    user: userId,
                    purchaseDate: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth,
                    },
                }).select('_id');

                const prevTransactionIds = prevTransactions.map((t) => t._id);

                let spentAmount = 0;

                if (prevTransactionIds.length > 0) {
                    const categoryId =
                        typeof prev.category === 'object' &&
                        '_id' in prev.category
                            ? prev.category._id
                            : prev.category;
                    const details = await TransactionDetail.aggregate([
                        {
                            $match: {
                                transaction: { $in: prevTransactionIds },
                            },
                        },
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'product',
                                foreignField: '_id',
                                as: 'productData',
                            },
                        },
                        { $unwind: '$productData' },
                        ...(prev.category
                            ? [
                                  {
                                      $match: {
                                          'productData.category':
                                              new Types.ObjectId(categoryId),
                                      },
                                  },
                              ]
                            : []),
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$subtotal' },
                            },
                        },
                    ]);

                    spentAmount = details.length > 0 ? details[0].total : 0;
                }

                await Budget.create({
                    user: prev.user,
                    category: prev.category,
                    month,
                    year,
                    limitAmount: prev.limitAmount,
                    isRecurring: prev.isRecurring,
                    isActive: prev.isActive,
                    notificationsEnabled: prev.notificationsEnabled,
                    spentAmount,
                });
            }

            budgets = await Budget.find({
                user: userId,
                month,
                year,
            }).populate('category');
        }

        const updatedBudgets: any[] = [];

        if (!isCurrentMonth) {
            budgets.forEach((b) => updatedBudgets.push(b));
            res.json(updatedBudgets);
            return;
        }

        const startOfMonth = dayjs(`${year}-${month}-01`)
            .startOf('month')
            .toDate();
        const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month').toDate();

        const transactions = await Transaction.find({
            user: userId,
            purchaseDate: { $gte: startOfMonth, $lte: endOfMonth },
        }).select('_id');

        const transactionIds = transactions.map((t) => t._id);

        for (const budget of budgets) {
            let spentAmount = 0;

            if (transactionIds.length > 0) {
                const details = await TransactionDetail.aggregate([
                    { $match: { transaction: { $in: transactionIds } } },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'product',
                            foreignField: '_id',
                            as: 'productData',
                        },
                    },
                    { $unwind: '$productData' },
                    ...(budget.category
                        ? [
                              {
                                  $match: {
                                      'productData.category':
                                          new Types.ObjectId(
                                              budget.category._id,
                                          ),
                                  },
                              },
                          ]
                        : []),
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$subtotal' },
                        },
                    },
                ]);

                spentAmount = details.length > 0 ? details[0].total : 0;
            }

            updatedBudgets.push({
                ...budget.toObject(),
                spentAmount,
            });
        }

        res.json(updatedBudgets);
    } catch (error) {
        logger.error('Error en getBudgets:', error);
        res.status(500).json({
            message: 'Error al obtener los presupuestos',
            error,
        });
    }
};

export const createBudget = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const {
            category,
            month,
            year,
            limitAmount,
            isRecurring,
            isActive,
            notificationsEnabled,
        } = req.body;

        const existing = await Budget.findOne({
            user: userId,
            month,
            year,
            category: category || null,
        });

        if (existing) {
            res.status(400).json({
                message:
                    'Ya existe un presupuesto para esta categoría en este mes',
            });
            return;
        }

        const budget = await Budget.create({
            user: userId,
            category: category || undefined,
            month,
            year,
            limitAmount,
            isRecurring,
            isActive,
            notificationsEnabled,
        });

        const startOfMonth = dayjs(`${year}-${month}-01`)
            .startOf('month')
            .toDate();
        const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month').toDate();

        const transactions = await Transaction.find({
            user: userId,
            purchaseDate: { $gte: startOfMonth, $lte: endOfMonth },
        }).select('_id');

        const transactionIds = transactions.map((t) => t._id);

        let spentAmount = 0;

        if (transactionIds.length > 0) {
            const details = await TransactionDetail.aggregate([
                {
                    $match: {
                        transaction: { $in: transactionIds },
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productData',
                    },
                },
                { $unwind: '$productData' },
                ...(category
                    ? [
                          {
                              $match: {
                                  'productData.category': new Types.ObjectId(
                                      category,
                                  ),
                              },
                          },
                      ]
                    : []),
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$subtotal' },
                    },
                },
            ]);

            spentAmount = details.length > 0 ? details[0].total : 0;
        }

        const populatedBudget = await Budget.findById(budget._id).populate(
            'category',
        );

        res.status(201).json({
            ...populatedBudget?.toObject(),
            spentAmount,
        });
    } catch (error) {
        logger.error('Error en createBudget:', error);
        res.status(500).json({
            message: 'Error al crear el presupuesto',
            error,
        });
    }
};

export const updateBudget = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const updated = await Budget.findByIdAndUpdate(id, req.body, {
            new: true,
        }).populate('category');

        if (!updated) {
            res.status(404).json({ message: 'Presupuesto no encontrado' });
            return;
        }

        res.json(updated);
    } catch (error) {
        logger.error('Error en updateBudget:', error);
        res.status(500).json({
            message: 'Error al actualizar el presupuesto',
            error,
        });
    }
};

export const deleteBudget = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await Budget.findByIdAndDelete(id);

        if (!deleted) {
            res.status(404).json({ message: 'Presupuesto no encontrado' });
            return;
        }

        res.json({ message: 'Presupuesto eliminado correctamente' });
    } catch (error) {
        logger.error('Error en deleteBudget:', error);
        res.status(500).json({
            message: 'Error al eliminar el presupuesto',
            error,
        });
    }
};
