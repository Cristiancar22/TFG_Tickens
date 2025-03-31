import { Router } from 'express';
import { authenticateToken, uploadAvatar } from '../middlewares';
import {
	updatePassword,
	updateAvatar,
	updateProfile,
} from '../controllers/profile.controller';

const router = Router();

router.patch('/password', authenticateToken, updatePassword);
router.patch('/', authenticateToken, updateProfile);
router.patch('/avatar', authenticateToken, uploadAvatar, updateAvatar);

export default router;
