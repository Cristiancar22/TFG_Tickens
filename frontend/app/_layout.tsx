import '../global.css';

import { Slot, useSegments, useRouter } from 'expo-router';
import { useAuth } from '../store/useAuth';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getUserFromToken } from '@/services';
import { useProducts } from '@/store/useProduct';
import { useStores } from '@/store/useStore';
import { useCategories } from '@/store/useCategories';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
    const { isAuthenticated, checking, login, logout, setUser, setChecking } =
        useAuth();
    const segments = useSegments();
    const router = useRouter();

    const fetchProducts = useProducts((s) => s.fetchProducts);
    const fetchStores = useStores((s) => s.fetchStores);
    const fetchCategories = useCategories((s) => s.fetchCategories);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('token');

                if (storedToken) {
                    login(storedToken);
                    const user = await getUserFromToken();
                    setUser(user);
                } else {
                    setChecking(false);
                }
            } catch (error) {
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

        if (isAuthenticated) {
            fetchProducts();
            fetchStores();
            fetchCategories();
        }
    }, [isAuthenticated, segments, checking]);

    if (checking) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Slot />;
}
