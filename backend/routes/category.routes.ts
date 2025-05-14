import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { getCategories } from '../controllers/category.controller';

const router = Router();

router.get('/', authenticateToken, getCategories);

export default router;