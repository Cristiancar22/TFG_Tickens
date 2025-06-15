import { Router } from 'express';
import {
    getUserNotifications,
    updateNotificationStatus,
} from '../controllers/notifications.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getUserNotifications);

router.patch('/:id', authenticateToken, updateNotificationStatus);

export default router;
