import { create } from 'zustand';

type AuthStore = {
	token: string | null
	isAuthenticated: boolean
	checking: boolean
	login: (token: string) => void
	logout: () => void
	setChecking: (checking: boolean) => void
}

export const useAuth = create<AuthStore>((set) => ({
	token: null,
	isAuthenticated: false,
	checking: true,

	login: (token) =>
		set({
			token,
			isAuthenticated: true,
			checking: false,
		}),

	logout: () =>
		set({
			token: null,
			isAuthenticated: false,
			checking: false,
		}),

	setChecking: (checking) => set({ checking }),
}))
