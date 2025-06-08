import { useEffect, useCallback } from 'react';
import {
    ScrollView,
    RefreshControl,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/store/useAuth';
import { useUserStats } from '@/store/useUserStats';
import { useBudgets } from '@/store/useBudgets';
import { colors } from '@/constants/colors';
import { BudgetProgressItem } from '@/components/budgets';

export const HomeScreen = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { stats, loading, fetchStats } = useUserStats();
    const budgets = useBudgets((s) => s.budgets);
    const fetchBudgets = useBudgets((s) => s.fetchBudgets);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    useEffect(() => {
        fetchStats();
        fetchBudgets(month, year);
    }, [month, year]);

    const onRefresh = useCallback(() => {
        fetchStats();
        fetchBudgets(month, year);
    }, [month, year]);

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

                <View className="bg-white p-4 rounded-xl shadow mb-6">
                    <Text className="text-lg text-foreground mb-4">
                        Presupuestos del mes
                    </Text>

                    {budgets.length === 0 ? (
                        <Text className="text-center text-foreground">
                            No hay presupuestos
                        </Text>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                            }}
                        >
                            {budgets.map((budget) => (
                                <View
                                    key={budget.id}
                                    style={{
                                        width: '47%',
                                        marginBottom: 16,
                                        overflow: 'visible',
                                    }}
                                >
                                    <BudgetProgressItem budget={budget} />
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Botones */}
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/manageProducts')}
                    className="bg-primary flex-row items-center justify-between p-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-lg font-semibold">
                        Gestionar Productos
                    </Text>
                    <Ionicons name="cube-outline" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/manageStores')}
                    className="bg-secondary flex-row items-center justify-between p-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-lg font-semibold">
                        Gestionar Tiendas
                    </Text>
                    <Ionicons
                        name="storefront-outline"
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/manageBudgets')}
                    className="bg-accent flex-row items-center justify-between p-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-lg font-semibold">
                        Gestionar Presupuestos
                    </Text>
                    <Ionicons name="wallet-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/manageSavings')}
                    className="bg-danger flex-row items-center justify-between p-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-lg font-semibold">
                        Gestionar Ahorro
                    </Text>
                    <Ionicons
                        name="stats-chart-outline"
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
