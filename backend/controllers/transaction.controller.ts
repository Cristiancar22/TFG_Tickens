import { Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import { AuthRequest } from '../middlewares';
import { logger } from '../utils/logger';

export const getRecentTransactions = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const userId = req.user!._id;

        const transactions = await Transaction.find({ user: userId })
            .sort({ purchaseDate: -1 })
            .limit(limit)
            .populate('store', 'name')
            .lean();

        res.status(200).json(transactions);
    } catch (error) {
        logger.error('Error al obtener transacciones:', error);
        res.status(500).json({ message: 'Error al obtener transacciones' });
    }
};

export const getTransactionById = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const transactionId = req.params.id;
        const userId = req.user!._id;

        const transaction = await Transaction.findOne({
            _id: transactionId,
            user: userId,
        })
            .populate('store', 'name')
            .lean();

        if (!transaction) {
            res.status(404).json({ message: 'Transacción no encontrada' });
            return;
        }

        const details = await TransactionDetail.find({
            transaction: transaction._id,
        })
            .populate('product', 'name')
            .lean();

        res.json({ ...transaction, details });
    } catch (err) {
        logger.error('Error al obtener detalle de transacción:', err);
        res.status(500).json({ message: 'Error al obtener detalle' });
    }
};

export const updateTransaction = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const allDetails = (await TransactionDetail.find().lean()) as any[];
    logger.info('Detalles de transacción:', allDetails);
    // Transformar los datos al nuevo formato (cambiar producto → product)
    const updatedDetails = allDetails.map(({ producto, ...rest }) => ({
        ...rest,
        product: producto, // renombrar campo aquí
    }));
    logger.info('Detalles de transacción transformados:', updatedDetails);

    await TransactionDetail.collection.drop();

    logger.info('Detalles de transacción eliminados');

    await TransactionDetail.insertMany(updatedDetails);

    logger.info('Detalles de transacción insertados');

    res.json({ success: true });
};
