import axios from 'axios';
import { api } from './api';
import { SavingsGoal } from '@/types';

type SavingsGoalInput = Omit<SavingsGoal, 'id' | 'accumulatedAmount'>;

export const getCurrentSavingsGoal = async (): Promise<SavingsGoal | null> => {
    try {
        const res = await api.get('/savings-goals');
        if (!res.data) return null;

        return {
            ...res.data,
            id: res.data._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al obtener el objetivo de ahorro actual');
    }
};

export const getAllSavingsGoals = async (): Promise<SavingsGoal[]> => {
    try {
        const res = await api.get('/savings-goals/all');
        return res.data.map((goal: any) => ({
            ...goal,
            id: goal._id,
        }));
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al obtener todas las metas de ahorro');
    }
};

export const createSavingsGoal = async (
    data: SavingsGoalInput,
): Promise<SavingsGoal> => {
    try {
        const res = await api.post('/savings-goals', data);
        return {
            ...res.data,
            id: res.data._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al crear el objetivo de ahorro');
    }
};

export const updateSavingsGoal = async (
    id: string,
    data: Partial<SavingsGoalInput>,
): Promise<SavingsGoal> => {
    try {
        const res = await api.patch(`/savings-goals/${id}`, data);
        return {
            ...res.data,
            id: res.data._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al actualizar el objetivo de ahorro');
    }
};

export const deleteSavingsGoal = async (id: string): Promise<void> => {
    try {
        await api.delete(`/savings-goals/${id}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al eliminar el objetivo de ahorro');
    }
};

export const getTotalSavings = async (): Promise<number> => {
    try {
        const response = await api.get('/savings-goals/total');
        return response.data.totalSavings;
    } catch (error: unknown) {
        throw new Error('Error al obtener el ahorro total');
    }
};

export const getSavingsRecommendations = async (): Promise<string[]> => {
    try {
        const response = await api.get('/savings-goals/recommendations');
        return response.data.recommendations;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al obtener recomendaciones de ahorro');
    }
};
