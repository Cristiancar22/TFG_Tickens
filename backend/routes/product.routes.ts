import { Router } from 'express';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    groupProducts,
    getProductPriceComparison,
} from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getProducts);

router.get('/:productId/store-price-comparison', authenticateToken, getProductPriceComparison);

router.post('/', authenticateToken, createProduct);

router.post('/group', authenticateToken, groupProducts);

router.patch('/:id', authenticateToken, updateProduct);

router.delete('/:id', authenticateToken, deleteProduct);

export default router;
