import { create } from 'zustand';
import { getUserStats } from '@/services/userStats.service';

interface UserStats {
    currentMonthTransactionCount: number;
    currentMonthSpending: number;
}

interface UserStatsState {
    stats: UserStats | null;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
}

export const useUserStats = create<UserStatsState>((set) => ({
    stats: null,
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getUserStats();
            set({ stats: data, loading: false });
        } catch (err) {
            set({
                error: `Error al cargar estadísticas: ${err}`,
                loading: false,
            });
        }
    },
}));
