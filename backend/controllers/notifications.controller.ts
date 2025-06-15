import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Notification } from '../models/notification.model';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

export const getUserNotifications = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const notifications = await Notification.find({ user: userId, status: { $ne: 'archived' } })
            .sort({ creationDate: -1 });

        res.json(notifications);
    } catch (error) {
        logger.error('Error al obtener notificaciones:', error);
        res.status(500).json({
            message: 'Error al obtener notificaciones',
            error,
        });
    }
};

export const updateNotificationStatus = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const notificationId = req.params.id;
        const userId = req.user?._id;
        const { status } = req.body;

        if (!Types.ObjectId.isValid(notificationId)) {
            res.status(400).json({ message: 'ID de notificación no válido' });
            return;
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { status },
            { new: true },
        );

        if (!notification) {
            res.status(404).json({ message: 'Notificación no encontrada' });
            return;
        }

        res.json(notification);
    } catch (error) {
        logger.error('Error al actualizar la notificación:', error);
        res.status(500).json({
            message: 'Error al actualizar la notificación',
            error,
        });
    }
};
