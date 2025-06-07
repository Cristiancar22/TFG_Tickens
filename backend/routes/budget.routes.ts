import { Router } from 'express';
import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
} from '../controllers/budget.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getBudgets);

router.post('/', authenticateToken, createBudget);

router.patch('/:id', authenticateToken, updateBudget);

router.delete('/:id', authenticateToken, deleteBudget);

export default router;
