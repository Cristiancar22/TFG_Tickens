import { Response } from 'express';
import { Store } from '../models/store.model';
import { AuthRequest } from '../middlewares/auth.middleware';

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
