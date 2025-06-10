import { Response } from 'express';
import { ProductCategory } from '../models/productCategory.model';
import { AuthRequest } from '../middlewares';
import { logger } from '../utils/logger';

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const categories = await ProductCategory.find().lean();
        res.json(categories);
    } catch (error) {
        logger.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};
