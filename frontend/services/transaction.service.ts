import { api } from './api';

export const getRecentTransactions = async () => {
    const response = await api.get('/transactions?limit=50');
    return response.data;
};

export const getTransactionById = async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
};
