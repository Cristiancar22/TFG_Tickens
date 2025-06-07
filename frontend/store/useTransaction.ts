import { getRecentTransactions } from '@/services/transaction.service';
import { Transaction } from '@/types';
import { create } from 'zustand';

type TransactionStore = {
    transactions: Transaction[];
    isLoading: boolean;
    error: boolean;
    errorMessage: string;
    fetchTransactions: () => Promise<void>;
    clear: () => void;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
    transactions: [],
    isLoading: false,
    error: false,
    errorMessage: '',

    fetchTransactions: async () => {
        try {
            set({ isLoading: true });
            const data = await getRecentTransactions();
            set({ transactions: data, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: true,
                errorMessage: `Error fetching transactions: ${error}`,
            });
        }
    },

    clear: () => set({ transactions: [], isLoading: false, error: false, errorMessage: '' }),
}));
