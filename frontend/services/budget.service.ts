import axios from 'axios';
import { api } from './api';
import { Budget, BudgetInput } from '@/types';

export const getBudgets = async (
    month: number,
    year: number,
): Promise<Budget[]> => {
    try {
        const response = await api.get('/budgets', {
            params: { month, year },
        });

        return response.data.map((budget: Budget) => ({
            ...budget,
            id: budget._id,
        }));
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al obtener los presupuestos');
    }
};

export const createBudget = async (
    data: BudgetInput,
): Promise<Budget> => {
    try {
        const response = await api.post('/budgets', data);
        const budget = response.data;
        return {
            ...budget,
            id: budget._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al crear el presupuesto');
    }
};

export const updateBudget = async (
    id: string,
    data: BudgetInput,
): Promise<Budget> => {
    try {
        const response = await api.patch(`/budgets/${id}`, data);
        const budget = response.data;
        return {
            ...budget,
            id: budget._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al actualizar el presupuesto');
    }
};

export const deleteBudget = async (id: string): Promise<void> => {
    try {
        await api.delete(`/budgets/${id}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al eliminar el presupuesto');
    }
};
