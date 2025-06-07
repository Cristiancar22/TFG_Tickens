import express from 'express';
import { getPredictionStats, getStats } from '../controllers/stats.controller';
import { authenticateToken } from '../middlewares';

const router = express.Router();

router.get('/', authenticateToken, getStats);
router.get('/prediction', authenticateToken, getPredictionStats);

export default router;
