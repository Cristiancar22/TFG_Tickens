import { create } from 'zustand';
import { Category } from '@/types';
import { getCategories } from '@/services/category.service';

type CategoryState = {
    categories: Category[];
    getCategoryById: (id: string) => Category | undefined;
    fetchCategories: () => Promise<void>;
    clear: () => void;
};

export const useCategories = create<CategoryState>((set, get) => ({
    categories: [],

    getCategoryById: (id) =>
        get().categories.find((category) => category._id === id),

    fetchCategories: async () => {
        try {
            const response = await getCategories();
            set({ categories: response });
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    },

    clear: () => set({ categories: [] }),
}));
