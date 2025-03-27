import '../global.css';

import { Slot, useSegments, useRouter } from 'expo-router';
import { useAuth } from '../store/useAuth';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getUserFromToken } from '@/services';

export default function RootLayout() {
	const { isAuthenticated, checking, login, logout, setUser, setChecking } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const storedToken = await SecureStore.getItemAsync('token');

				if ( storedToken ) {
					login(storedToken);

					const user = await getUserFromToken();
					setUser(user);
				} else {
					setChecking(false); 
				}
			} catch ( error ) {
				console.error('Error al verificar token:', error);
				logout();
			}
		};

		initializeAuth();
	}, []);

	useEffect(() => {
		if (checking) return;

		const inAuthGroup = segments[0] === '(auth)';

		if (!isAuthenticated && !inAuthGroup) {
			router.replace('/login');
		}

		if (isAuthenticated && inAuthGroup) {
			router.replace('/');
		}
	}, [isAuthenticated, segments]);

	return <Slot />;
}
