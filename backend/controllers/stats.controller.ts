import { Response } from 'express';
import { AuthRequest } from '../middlewares';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';
import { TransactionDetail } from '../models/transactionDetail.model';
import { Transaction } from '../models/transaction.model';

export const getStats = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { viewType, year, month } = req.query;
    const userId = req.user!._id;

    if (!viewType || !year || (viewType === 'monthly' && !month)) {
        res.status(400).json({ message: 'Parámetros insuficientes' });
        return;
    }

    const startDate = new Date(
        Number(year),
        viewType === 'monthly' ? Number(month) - 1 : 0,
        1,
    );
    const endDate =
        viewType === 'monthly'
            ? new Date(Number(year), Number(month), 1)
            : new Date(Number(year) + 1, 0, 1);

    try {
        if (viewType === 'monthly') {
            const result = await TransactionDetail.aggregate([
                {
                    $lookup: {
                        from: 'transactions',
                        localField: 'transaction',
                        foreignField: '_id',
                        as: 'transaction',
                    },
                },
                { $unwind: '$transaction' },
                {
                    $match: {
                        'transaction.user': new Types.ObjectId(userId),
                        'transaction.purchaseDate': {
                            $gte: startDate,
                            $lt: endDate,
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'product',
                    },
                },
                { $unwind: '$product' },
                {
                    $lookup: {
                        from: 'productcategories',
                        localField: 'product.category',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                {
                    $addFields: {
                        category: {
                            $cond: {
                                if: { $eq: [{ $size: '$category' }, 0] },
                                then: [{ _id: null, name: 'Sin categorizar' }],
                                else: '$category',
                            },
                        },
                    },
                },
                { $unwind: '$category' },
                {
                    $group: {
                        _id: '$category._id',
                        label: { $first: '$category.name' },
                        total: { $sum: '$subtotal' },
                        primaryColor: { $first: '$category.primaryColor' },
                    },
                },
                { $sort: { total: -1 } },
            ]);

            const response = result.map((r) => ({
                categoryId: r._id,
                label: r.label,
                value: r.total,
                color: r.primaryColor || '#225560',
            }));

            res.json(response);
        }

        else {
            const result = await Transaction.aggregate([
                {
                    $match: {
                        user: new Types.ObjectId(userId),
                        purchaseDate: { $gte: startDate, $lt: endDate },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$purchaseDate' },
                        total: { $sum: '$total' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const months = [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
            ];

            const formatted = result.map((r) => ({
                label: months[r._id - 1],
                value: r.total,
            }));

            res.json(formatted);
        }
    } catch (err) {
        logger.error('Error al obtener estadísticas:', err);
        res.status(500).json({
            message: 'Error interno al obtener estadísticas',
        });
    }
};

export const getPredictionStats = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { year, month } = req.query;
    const userId = req.user!._id;

    if (!year || !month) {
        res.status(400).json({ message: 'Parámetros insuficientes' });
        return;
    }

    try {
        const targetMonth = Number(month);
        const targetYear = Number(year);

        const monthWeights: Record<string, number> = {};

        const now = new Date(targetYear, targetMonth - 1, 1);

        for (let i = 1; i <= 12; i++) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);

            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

            const decayWeight = Math.max(0.1, 1 - i * 0.075);

            monthWeights[key] = decayWeight;
        }

        const sameMonthLastYear = `${targetYear - 1}-${targetMonth}`;
        monthWeights[sameMonthLastYear] = Math.max(
            monthWeights[sameMonthLastYear] ?? 0,
            0.6,
        );

        const startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 12);

        const endDate = new Date(now);

        const result = await TransactionDetail.aggregate([
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transaction',
                    foreignField: '_id',
                    as: 'transaction',
                },
            },
            { $unwind: '$transaction' },
            {
                $match: {
                    'transaction.user': new Types.ObjectId(userId),
                    'transaction.purchaseDate': {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $lookup: {
                    from: 'productcategories',
                    localField: 'product.category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $addFields: {
                    category: {
                        $cond: {
                            if: { $eq: [{ $size: '$category' }, 0] },
                            then: [{ _id: null, name: 'Sin categorizar' }],
                            else: '$category',
                        },
                    },
                },
            },
            { $unwind: '$category' },
            {
                $addFields: {
                    yearMonthKey: {
                        $concat: [
                            {
                                $toString: {
                                    $year: '$transaction.purchaseDate',
                                },
                            },
                            '-',
                            {
                                $toString: {
                                    $month: '$transaction.purchaseDate',
                                },
                            },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        categoryId: '$category._id',
                        yearMonthKey: '$yearMonthKey',
                    },
                    label: { $first: '$category.name' },
                    total: { $sum: '$subtotal' },
                    primaryColor: { $first: '$category.primaryColor' },
                },
            },
        ]);

        const categoryTotals: Record<
            string,
            {
                label: string;
                color: string;
                weightedTotal: number;
                totalWeight: number;
            }
        > = {};

        for (const entry of result) {
            const { categoryId, yearMonthKey } = entry._id;
            const weight = monthWeights[yearMonthKey] ?? 0;

            if (weight > 0) {
                if (!categoryTotals[categoryId]) {
                    categoryTotals[categoryId] = {
                        label: entry.label,
                        color: entry.primaryColor || '#225560',
                        weightedTotal: 0,
                        totalWeight: 0,
                    };
                }

                categoryTotals[categoryId].weightedTotal +=
                    entry.total * weight;
                categoryTotals[categoryId].totalWeight += weight;
            }
        }

        const response = Object.entries(categoryTotals).map(
            ([categoryId, data]) => {
                const predictedValue =
                    data.totalWeight > 0
                        ? data.weightedTotal / data.totalWeight
                        : 0;

                return {
                    categoryId,
                    label: data.label,
                    value: predictedValue.toFixed(2),
                    color: data.color,
                };
            },
        );

        res.json(response);
    } catch (err) {
        logger.error('Error al obtener predicción de estadísticas:', err);
        res.status(500).json({
            message: 'Error interno al obtener predicción',
        });
    }
};
