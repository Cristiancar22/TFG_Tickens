import { useAuth } from '@/store/useAuth';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useNotifications } from '@/store/useNotifications';

export const api = axios.create({
    baseURL: `${'http://83.63.127.211:5000'}/api/v1`,
});

let lastNotificationCheck = 0;

api.interceptors.request.use(async (config) => {
    const { token } = useAuth.getState();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) {
            config.headers.Authorization = `Bearer ${storedToken}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        const now = Date.now();
        const FIVE_SECONDS = 5000;

        const isNotNotificationEndpoint = !response.config.url?.includes('/api/notifications');
        const isAuthenticated = useAuth.getState().token;

        if (isNotNotificationEndpoint && isAuthenticated && now - lastNotificationCheck > FIVE_SECONDS) {
            lastNotificationCheck = now;
            useNotifications.getState().fetchNotifications();
        }

        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            useAuth.getState().logout();
        }
        return Promise.reject(error);
    },
);
