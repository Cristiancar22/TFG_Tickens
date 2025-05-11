import { Router } from 'express';
import {
    getStores,
    createStore,
    updateStore,
} from '../controllers/store.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getStores);

router.post('/', authenticateToken, createStore);

router.patch('/:id', authenticateToken, updateStore);

export default router;
