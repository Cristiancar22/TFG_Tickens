import { Response } from 'express';
import { Product } from '../models/product.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TransactionDetail } from '../models/transactionDetail.model';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export const getProducts = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const products = await Product.find({ createdBy: userId });

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos',
            error,
        });
    }
};

export const createProduct = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const product = await Product.create({
            ...req.body,
            createdBy: userId,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};

export const updateProduct = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const updated = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updated) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el producto',
            error,
        });
    }
};

export const deleteProduct = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await Product.findByIdAndDelete(id);

        if (!deleted) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el producto',
            error,
        });
    }
};

export const groupProducts = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { mainId, groupedIds } = req.body;

        if (!mainId || !Array.isArray(groupedIds) || groupedIds.length < 1) {
            res.status(400).json({ message: 'Datos de agrupación inválidos' });
            return;
        }

        const targetIds = groupedIds.filter((id: string) => id !== mainId);

        if (targetIds.length === 0) {
            res.status(400).json({
                message: 'No se puede agrupar solo el producto principal',
            });
            return;
        }

        const allProducts = await Product.find({
            _id: { $in: [mainId, ...targetIds] },
            createdBy: userId,
        });

        if (allProducts.length !== targetIds.length + 1) {
            res.status(403).json({
                message: 'No tienes permiso para agrupar uno o más productos',
            });
            return;
        }

        await TransactionDetail.updateMany(
            { product: { $in: targetIds } },
            { $set: { product: mainId } },
        );

        await Product.deleteMany({ _id: { $in: targetIds } });

        res.json({ message: 'Productos agrupados correctamente' });
    } catch (error) {
        logger.error('Error al agrupar productos:', error);
        res.status(500).json({
            message: 'Error al agrupar productos',
            error,
        });
    }
};

export const getProductPriceComparison = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { productId } = req.params;

        if (!productId) {
            res.status(400).json({ message: 'Falta el productId' });
            return;
        }

        const results = await TransactionDetail.aggregate([
            {
                $match: {
                    product: new Types.ObjectId(productId),
                },
            },
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
                },
            },
            {
                $lookup: {
                    from: 'stores',
                    localField: 'transaction.store',
                    foreignField: '_id',
                    as: 'store',
                },
            },
            { $unwind: '$store' },
            {
                $sort: {
                    'transaction.purchaseDate': -1,
                },
            },
            {
                $group: {
                    _id: '$store._id',
                    storeName: { $first: '$store.name' },
                    lastPrice: { $first: '$unitPrice' },
                    lastPurchaseDate: { $first: '$transaction.purchaseDate' },
                },
            },
            {
                $project: {
                    storeId: '$_id',
                    storeName: 1,
                    lastPrice: 1,
                    lastPurchaseDate: 1,
                    _id: 0,
                },
            },
            {
                $sort: {
                    storeName: 1,
                },
            },
        ]);

        res.json(results);
    } catch (error) {
        logger.error('Error en getProductPriceComparison:', error);
        res.status(500).json({
            message: 'Error al obtener el comparador de precios',
            error,
        });
    }
};

