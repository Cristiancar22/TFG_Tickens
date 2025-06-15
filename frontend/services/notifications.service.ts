import { api } from './api';
import { Notification } from '@/types';

export const getNotifications = async (): Promise<Notification[]> => {
    const res = await api.get('/notifications');
    return res.data;
};

export const markNotificationAsRead = async (
    id: string,
): Promise<Notification> => {
    const res = await api.patch(`/notifications/${id}`, { status: 'read' });
    return res.data;
};

export const archiveNotification = async (
    id: string,
): Promise<Notification> => {
    const res = await api.patch(`/notifications/${id}`, { status: 'archived' });
    return res.data;
};
