import { Router } from 'express';
import { getUserStats } from '../controllers/userStats.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getUserStats);

export default router;
