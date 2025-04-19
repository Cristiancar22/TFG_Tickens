import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionDetail } from '../models/transactionDetail.model';

export const getRecentTransactions = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const userId = (req as any).user._id;

        const transactions = await Transaction.find({ user: userId })
            .sort({ purchaseDate: -1 })
            .limit(limit)
            .populate('tienda', 'name')
            .lean();

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({ message: 'Error al obtener transacciones' });
    }
};

export const getTransactionById = async (
    req: Request,
    res: Response,
): Promise<any> => {
    try {
        const transactionId = req.params.id;
        const userId = (req as any).user._id;

        const transaction = await Transaction.findOne({
            _id: transactionId,
            user: userId,
        })
            .populate('tienda', 'name')
            .lean();

        if (!transaction) {
            return res
                .status(404)
                .json({ message: 'Transacción no encontrada' });
        }

        const detalles = await TransactionDetail.find({
            transaccion: transaction._id,
        })
            .populate('producto', 'name')
            .lean();

        res.json({ ...transaction, detalles });
    } catch (err) {
        console.error('Error al obtener detalle de transacción:', err);
        res.status(500).json({ message: 'Error al obtener detalle' });
    }
};
