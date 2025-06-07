import { api } from '@/services/api';

export const getUserStats = async () => {
    const response = await api.get('/user-stats');
    return response.data;
};
