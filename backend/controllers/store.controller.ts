import { Response } from 'express';
import { Store } from '../models/store.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Transaction } from '../models/transaction.model';
import { logger } from '../utils/logger';

export const getStores = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const stores = await Store.find({ createdBy: userId });

        res.json(stores);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las tiendas',
            error,
        });
    }
};

export const createStore = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const store = await Store.create({
            ...req.body,
            createdBy: userId,
        });

        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tienda', error });
    }
};

export const updateStore = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const updated = await Store.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updated) {
            res.status(404).json({ message: 'Tienda no encontrada' });
            return;
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar la tienda',
            error,
        });
    }
};

export const deleteStore = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await Store.findByIdAndDelete(id);

        if (!deleted) {
            res.status(404).json({ message: 'Tienda no encontrada' });
            return;
        }

        res.json({ message: 'Tienda eliminada correctamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar la tienda',
            error,
        });
    }
};

export const groupStores = async (
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
            res.status(400).json({ message: 'No se puede agrupar solo la tienda principal' });
            return;
        }

        const allStores = await Store.find({
            _id: { $in: [mainId, ...targetIds] },
            createdBy: userId,
        });

        if (allStores.length !== groupedIds.length) {
            res.status(403).json({
                message: 'No tienes permiso para agrupar una o más tiendas',
            });
            return;
        }

        await Transaction.updateMany(
            {
                user: userId,
                store: { $in: targetIds },
            },
            {
                $set: { store: mainId },
            }
        );

        await Store.deleteMany({ _id: { $in: targetIds } });

        res.json({ message: 'Tiendas agrupadas correctamente' });
    } catch (error) {
        logger.error('Error al agrupar tiendas:', error);
        res.status(500).json({
            message: 'Error al agrupar tiendas',
            error,
        });
    }
};

