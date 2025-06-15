import { create } from 'zustand';
import { Notification } from '@/types';
import {
    markNotificationAsRead,
    getNotifications as getNotificationsService,
    archiveNotification,
} from '@/services/notifications.service';

interface NotificationState {
    isFetching: boolean;
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    archiveNotification: (id: string) => Promise<void>;
    clear: () => void;
}

export const useNotifications = create<NotificationState>((set, get) => ({
    isFetching: false,
    notifications: [],
    setNotifications: (notifications) => set({ notifications }),

    fetchNotifications: async () => {
        if (get().isFetching) return;

        set({ isFetching: true });
        try {
            const fetched = await getNotificationsService();
            const current = get().notifications;
            const currentIds = new Set(current.map((n) => n._id));
            const newIds = new Set(fetched.map((n) => n._id));

            const changed =
                current.length !== fetched.length ||
                [...currentIds].some((id) => !newIds.has(id));

            if (changed) {
                set({ notifications: fetched });
            }
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
        } finally {
            set({ isFetching: false });
        }
    },

    markAsRead: async (id: string) => {
        try {
            const updated = await markNotificationAsRead(id);
            const newList = get().notifications.map((n) =>
                n._id === id ? updated : n,
            );
            set({ notifications: newList });
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    },

    archiveNotification: async (id: string) => {
        try {
            await archiveNotification(id);
            const newList = get().notifications.filter((n) => n._id !== id);
            set({ notifications: newList });
        } catch (error) {
            console.error('Error al archivar notificación:', error);
        }
    },

    clear: () => set({ notifications: [] }),
}));
