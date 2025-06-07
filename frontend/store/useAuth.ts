import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { useTransactionStore } from './useTransaction';
import { useCategories } from './useCategories';
import { useStores } from './useStore';
import { useProducts } from './useProduct';
import { useUserStats } from './useUserStats';

type User = {
    _id: string;
    name: string;
    surname: string;
    email: string;
    avatarUrl: string;
};

type AuthStore = {
    token: string | null;
    isAuthenticated: boolean;
    checking: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    setUser: (user: User | ((prev: User | null) => User)) => void;
    setChecking: (checking: boolean) => void;
};

export const useAuth = create<AuthStore>((set) => ({
    token: null,
    isAuthenticated: false,
    checking: true,
    user: null,

    login: async (token) => {
        await SecureStore.setItemAsync('token', token);
        set({
            token,
            isAuthenticated: true,
            checking: false,
        });
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('token');
        set({
            token: null,
            isAuthenticated: false,
            checking: false,
        });

        useTransactionStore.getState().clear();
        useCategories.getState().clear();
        useStores.getState().clear();
        useProducts.getState().clear();
        useUserStats.getState().clear();
    },

    setUser: (input) =>
        set(({ user }) => ({
            user: typeof input === 'function' ? input(user) : input,
        })),

    setChecking: (checking) => set({ checking }),
}));
