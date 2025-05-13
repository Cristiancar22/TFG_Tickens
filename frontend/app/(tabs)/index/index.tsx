import { useEffect, useCallback } from 'react';
import {
    ScrollView,
    RefreshControl,
    View,
    Text,
    Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/store/useAuth';
import { useUserStats } from '@/store/useUserStats';
import { colors } from '@/constants/colors';

export const HomeScreen = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { stats, loading, fetchStats } = useUserStats();

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = useCallback(() => {
        fetchStats();
    }, []);

    return (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: colors.background }}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
        >
            <View className="p-6">
                <Text className="text-2xl font-bold text-primary mb-4">
                    ¡Hola {user?.name}!
                </Text>

                <View className="bg-white p-4 rounded-xl shadow mb-6">
                    <Text className="text-lg text-foreground mb-1">
                        Transacciones este mes:
                    </Text>
                    <Text className="text-xl font-bold text-secondary mb-3">
                        {stats?.currentMonthTransactionCount ?? 0}
                    </Text>

                    <Text className="text-lg text-foreground mb-1">
                        Total gastado este mes:
                    </Text>
                    <Text className="text-xl font-bold text-secondary">
                        {stats?.currentMonthSpending?.toFixed(2) ?? '0.00'} €
                    </Text>
                </View>

                <Pressable
                    onPress={() => router.push('/(tabs)/manageProducts')}
                    className="bg-primary flex-row items-center justify-between p-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-lg font-semibold">
                        Gestionar Productos
                    </Text>
                    <Ionicons name="cube-outline" size={24} color="white" />
                </Pressable>

                <Pressable
                    onPress={() => router.push('/(tabs)/manageStores')}
                    className="bg-secondary flex-row items-center justify-between p-4 rounded-xl"
                >
                    <Text className="text-white text-lg font-semibold">
                        Gestionar Tiendas
                    </Text>
                    <Ionicons
                        name="storefront-outline"
                        size={24}
                        color="white"
                    />
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
