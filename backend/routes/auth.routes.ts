import { Router } from 'express';
import { checkToken, login, register } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-token', authenticateToken, checkToken);

export default router;
