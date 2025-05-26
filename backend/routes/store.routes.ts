import { Router } from 'express';
import {
    getStores,
    createStore,
    updateStore,
    deleteStore,
    groupStores,
} from '../controllers/store.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getStores);

router.post('/', authenticateToken, createStore);

router.post('/group', authenticateToken, groupStores);

router.patch('/:id', authenticateToken, updateStore);

router.delete('/:id', authenticateToken, deleteStore);

export default router;
