import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
    getRecentTransactions,
    getTransactionById,
    updateTransaction,
} from '../controllers/transaction.controller';

const router = Router();

router.get('/', authenticateToken, getRecentTransactions);
router.get('/:id', authenticateToken, getTransactionById);

router.put('/:id', authenticateToken, updateTransaction);

export default router;
