import { create } from 'zustand';
import { Budget, BudgetInput } from '@/types';
import {
    getBudgets as getBudgetsService,
    createBudget as createBudgetService,
    updateBudget as updateBudgetService,
    deleteBudget as deleteBudgetService,
} from '@/services/budget.service';

type BudgetsState = {
    budgets: Budget[];
    setBudgets: (budgets: Budget[]) => void;
    fetchBudgets: (month: number, year: number) => Promise<void>;
    createBudget: (data: BudgetInput) => Promise<void>;
    updateBudget: (
        id: string,
        data: BudgetInput,
    ) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    clear: () => void;
};

export const useBudgets = create<BudgetsState>((set, get) => ({
    budgets: [],
    setBudgets: (budgets) => set({ budgets }),

    fetchBudgets: async (month, year) => {
        try {
            const budgets = await getBudgetsService(month, year);
            set({ budgets });
        } catch (error) {
            console.error('Error al cargar presupuestos:', error);
        }
    },

    createBudget: async (data) => {
        try {
            const newBudget = await createBudgetService(data);
            const current = get().budgets;
            set({ budgets: [...current, newBudget] });
        } catch (error) {
            console.error('Error al crear presupuesto:', error);
            throw error;
        }
    },

    updateBudget: async (id, data) => {
        try {
            const updatedBudget = await updateBudgetService(id, data);
            const current = get().budgets;

            const updatedBudgets = current.map((budget) =>
                budget.id === id ? updatedBudget : budget,
            );

            set({ budgets: updatedBudgets });
        } catch (error) {
            console.error('Error al actualizar presupuesto:', error);
            throw error;
        }
    },

    deleteBudget: async (id) => {
        try {
            await deleteBudgetService(id);
            set({ budgets: get().budgets.filter((b) => b.id !== id) });
        } catch (error) {
            console.error('Error al eliminar presupuesto:', error);
            throw error;
        }
    },

    clear: () => set({ budgets: [] }),
}));
