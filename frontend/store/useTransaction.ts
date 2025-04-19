import { getRecentTransactions } from "@/services/transaction.service";
import { create } from "zustand";

type Transaction = {
  _id: string;
  total: number;
  purchaseDate: string;
  tienda: { name: string }; // ajusta según tu backend
};

type TransactionStore = {
    transactions: Transaction[];
    isLoading: boolean;
    fetchTransactions: () => Promise<void>;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
    transactions: [],
    isLoading: false,

    fetchTransactions: async () => {
        try {
            set({ isLoading: true });
        const data = await getRecentTransactions();
            set({ transactions: data, isLoading: false });
        } catch (error) {
            console.error("Error al cargar transacciones:", error);
            set({ isLoading: false });
        }
    },
}));
