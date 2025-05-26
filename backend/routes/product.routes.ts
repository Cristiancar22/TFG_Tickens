import { Router } from 'express';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    groupProducts,
} from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getProducts);

router.post('/', authenticateToken, createProduct);

router.post('/group', authenticateToken, groupProducts);


router.patch('/:id', authenticateToken, updateProduct);

router.delete('/:id', authenticateToken, deleteProduct);

export default router;
