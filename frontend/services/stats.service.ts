import { api } from './api';

interface StatsRequestParams {
    viewType: 'monthly' | 'annual';
    year: number;
    month?: number;
}

export const getStatsData = async ({
    viewType,
    year,
    month,
}: StatsRequestParams) => {
    const response = await api.get('/stats', {
        params: {
            viewType,
            year,
            month,
        },
    });
    return response.data;
};
