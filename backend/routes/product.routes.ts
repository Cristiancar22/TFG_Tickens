import { Router } from 'express';
import {
    getProducts,
    createProduct,
    updateProduct,
} from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getProducts);

router.post('/', authenticateToken, createProduct);

router.patch('/:id', authenticateToken, updateProduct);

export default router;
