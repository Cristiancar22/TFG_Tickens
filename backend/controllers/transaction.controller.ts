import { Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import { AuthRequest } from '../middlewares';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

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
        }).lean();

        if (!transaction) {
            res.status(404).json({ message: 'Transacción no encontrada' });
            return;
        }

        const details = await TransactionDetail.find({
            transaction: transaction._id,
        }).select('product quantity unitPrice subtotal').lean();

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
    try {
        const transactionId = req.body._id;
        const userId = req.user!._id;

        const existingTransaction = await Transaction.findOne({
            _id: transactionId,
            user: userId,
        });

        if (!existingTransaction) {
            res.status(404).json({ message: 'Transacción no encontrada' });
            return;
        }

        const {
            store,
            purchaseDate,
            total,
            ticket,
            paymentMethod,
            transactionCategory,
            notes,
        } = req.body;

        existingTransaction.store = store;
        existingTransaction.purchaseDate = new Date(purchaseDate);
        existingTransaction.total = total;
        existingTransaction.ticket = ticket;
        existingTransaction.paymentMethod = paymentMethod;
        existingTransaction.transactionCategory = transactionCategory;
        existingTransaction.notes = notes;

        await existingTransaction.save();

        await TransactionDetail.deleteMany({ transaction: transactionId });

        const newDetails = req.body.details.map((detail: any) => ({
            transaction: transactionId,
            product: detail.product ? new Types.ObjectId(String(detail.product)) : undefined,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            subtotal: detail.subtotal,
        }));

        await TransactionDetail.insertMany(newDetails);

        res.json({ success: true });
    } catch (err) {
        logger.error('Error al actualizar transacción:', err);
        res.status(500).json({ message: 'Error al actualizar transacción' });
    }
};

export const createTransaction = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user!._id;

        const {
            store,
            purchaseDate,
            total,
            ticket,
            paymentMethod,
            transactionCategory,
            notes,
            details,
        } = req.body;

        const transaction = new Transaction({
            user: userId,
            store,
            purchaseDate: new Date(purchaseDate),
            total,
            ticket,
            paymentMethod,
            transactionCategory,
            notes,
        });

        await transaction.save();

        const detailDocs = (details || []).map((detail: any) => ({
            transaction: transaction._id,
            product: detail.product ? new Types.ObjectId(String(detail.product)) : undefined,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            subtotal: detail.subtotal,
        }));

        await TransactionDetail.insertMany(detailDocs);

        res.status(201).json({ success: true, transactionId: transaction._id });
    } catch (err) {
        logger.error('Error al crear transacción:', err);
        res.status(500).json({ message: 'Error al crear la transacción' });
    }
};
