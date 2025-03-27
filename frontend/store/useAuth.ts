import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type User = {
	_id: string
	name: string
	surname: string
	email: string
}

type AuthStore = {
	token: string | null
	isAuthenticated: boolean
	checking: boolean
	user: User | null
	login: (token: string) => void
	logout: () => void
	setUser: (user: User) => void
	setChecking: (checking: boolean) => void
}

export const useAuth = create<AuthStore>((set) => ({
	token: null,
	isAuthenticated: false,
	checking: true,
	user: null,

	login: async( token ) => {
		await SecureStore.setItemAsync('token', token);
		set({
			token,
			isAuthenticated: true,
			checking: false,
		})
	},

	logout: async() => {
		await SecureStore.deleteItemAsync('token');
		set({
			token: null,
			isAuthenticated: false,
			checking: false,
		})
	},
 
	setUser: (user) => set({ user }),
	setChecking: (checking) => set({ checking }),
}));
