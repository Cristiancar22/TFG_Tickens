import { Response } from 'express';
import { Product } from '../models/product.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getProducts = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const products = await Product.find({ createdBy: userId })
            .populate('group');

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
