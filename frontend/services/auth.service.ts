import axios from 'axios';
import { api } from './api';

type LoginData = { email: string; password: string };

type RegisterData = {
    name: string;
    surname?: string;
    email: string;
    password: string;
};

type User = {
    _id: string;
    name: string;
    surname: string;
    email: string;
    avatarUrl: string;
};

export const loginUser = async (data: LoginData) => {
    try {
        const response = await api.post('/auth/login', data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al iniciar sesión');
    }
};

export const registerUser = async (data: RegisterData) => {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al registrar usuario');
    }
};

export const getUserFromToken = async (): Promise<User> => {
    try {
        const response = await api.get('/auth/check-token');
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Token inválido o expirado');
    }
};
