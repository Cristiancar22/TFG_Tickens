import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Transaction } from '../models/transaction.model';
import dayjs from 'dayjs';

export const getUserStats = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const startOfMonth = dayjs().startOf('month').toDate();
        const endOfMonth = dayjs().endOf('month').toDate();

        const transactions = await Transaction.find({
            user: userId,
            purchaseDate: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const currentMonthTransactionCount = transactions.length;
        const currentMonthSpending = transactions.reduce(
            (total, t) => total + (t.total || 0),
            0,
        ).toFixed(2);
        const currentMonthSpendingFormatted = parseFloat(currentMonthSpending);

        res.json({
            currentMonthTransactionCount,
            currentMonthSpending: currentMonthSpendingFormatted,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las estadísticas del usuario',
            error,
        });
    }
};
