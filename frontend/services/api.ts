import { useAuth } from '@/store/useAuth';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const api = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.223:5000'}/api/v1`,
});

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
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuth.getState().logout();
        }
        return Promise.reject(error);
    },
);
