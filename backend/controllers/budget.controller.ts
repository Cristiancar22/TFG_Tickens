import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Budget } from '../models/budget.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import { Transaction } from '../models/transaction.model';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

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

        // 1️⃣ Si no existen, replicar recurrentes
        const existingBudgets = await Budget.find({
            user: userId,
            month,
            year,
        }).populate('category');

        if (existingBudgets.length === 0) {
            const previousMonth = month === 1 ? 12 : month - 1;
            const previousYear = month === 1 ? year - 1 : year;

            const recurringBudgets = await Budget.find({
                user: userId,
                month: previousMonth,
                year: previousYear,
                isRecurring: true,
            });

            const newBudgets = recurringBudgets.map((budget) => ({
                user: budget.user,
                category: budget.category,
                limitAmount: budget.limitAmount,
                spentAmount: 0,
                month,
                year,
                notificationsEnabled: budget.notificationsEnabled,
                isActive: budget.isActive,
                isRecurring: budget.isRecurring,
            }));

            if (newBudgets.length > 0) {
                await Budget.insertMany(newBudgets);
            }
        }

        // 2️⃣ Obtener los budgets actualizados
        const budgets = await Budget.find({
            user: userId,
            month,
            year,
        }).populate('category');

        // 3️⃣ Obtener transacciones del mes
        const startOfMonth = dayjs(`${year}-${month}-01`)
            .startOf('month')
            .toDate();
        const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month').toDate();

        const transactions = await Transaction.find({
            user: userId,
            purchaseDate: { $gte: startOfMonth, $lte: endOfMonth },
        }).select('_id');

        const transactionIds = transactions.map((t) => t._id);

        // 4️⃣ Calcular spentAmount para cada budget
        const updatedBudgets = [];

        for (const budget of budgets) {
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

            // Opcional: podrías actualizarlo en DB si quisieras:
            // budget.spentAmount = spentAmount;
            // await budget.save();

            // Para la respuesta, devolvemos budget con spentAmount actualizado
            updatedBudgets.push({
                ...budget.toObject(),
                spentAmount,
            });
        }

        res.json(updatedBudgets);
    } catch (error) {
        console.error('Error en getBudgets:', error);
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
                                  'productData.category': new Types.ObjectId(category),
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
        console.error('Error en createBudget:', error);
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
        console.error('Error en updateBudget:', error);
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
        console.error('Error en deleteBudget:', error);
        res.status(500).json({
            message: 'Error al eliminar el presupuesto',
            error,
        });
    }
};
