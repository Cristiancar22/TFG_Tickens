import express from 'express';
import { getStats } from '../controllers/stats.controller';
import { authenticateToken } from '../middlewares';

const router = express.Router();

router.get('/', authenticateToken, getStats);

export default router;
