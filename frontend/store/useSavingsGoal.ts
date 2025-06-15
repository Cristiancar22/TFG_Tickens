import { create } from 'zustand';
import { SavingsGoal } from '@/types';
import {
    getAllSavingsGoals,
    getCurrentSavingsGoal,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    getTotalSavings,
} from '@/services/savings.service';

interface SavingsGoalState {
    currentGoal: SavingsGoal | null;
    history: SavingsGoal[];
    totalSavings: number;
    loading: boolean;
    error: string | null;

    fetchCurrentGoal: () => Promise<void>;
    fetchAllGoals: () => Promise<void>;
    fetchTotalSavings: () => Promise<void>;

    createGoal: (
        data: Omit<SavingsGoal, 'id' | 'accumulatedAmount'>,
    ) => Promise<void>;
    updateGoal: (id: string, data: Partial<SavingsGoal>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useSavingsGoalStore = create<SavingsGoalState>((set) => ({
    currentGoal: null,
    history: [],
    totalSavings: 0,
    loading: false,
    error: null,

    fetchCurrentGoal: async () => {
        set({ loading: true });
        try {
            const goal = await getCurrentSavingsGoal();
            set({ currentGoal: goal, error: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchAllGoals: async () => {
        set({ loading: true });
        try {
            const goals = await getAllSavingsGoals();
            set({ history: goals, error: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchTotalSavings: async () => {
        set({ loading: true });
        try {
            const total = await getTotalSavings();
            
            set({ totalSavings: total, error: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    createGoal: async (data) => {
        set({ loading: true });
        try {
            const newGoal = await createSavingsGoal(data);
            set({ currentGoal: newGoal, error: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    updateGoal: async (id, data) => {
        set({ loading: true });
        try {
            const updated = await updateSavingsGoal(id, data);
            set({ currentGoal: updated, error: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    deleteGoal: async (id) => {
        set({ loading: true });
        try {
            await deleteSavingsGoal(id);
            set({ currentGoal: null, error: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
