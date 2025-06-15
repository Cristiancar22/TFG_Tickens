import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSavingsGoalStore } from '@/store/useSavingsGoal';
import { Ionicons } from '@expo/vector-icons';

export default function SavingsHomeScreen() {
    const router = useRouter();

    const { currentGoal, totalSavings, fetchCurrentGoal, fetchTotalSavings } =
        useSavingsGoalStore();

    useEffect(() => {
        fetchCurrentGoal();
        fetchTotalSavings();
    }, []);

    const progress =
        currentGoal && currentGoal.targetAmount > 0
            ? Math.min(
                  (currentGoal.accumulatedAmount ?? 0) /
                      currentGoal.targetAmount,
                  1,
              )
            : 0;
    const buttons = [
        {
            route: '/(tabs)/savings/editGoal',
            label: currentGoal
                ? 'Editar objetivo de ahorro'
                : 'Establecer objetivo de ahorro',
            color: 'bg-blue-500',
            icon: 'create-outline',
            a11y: 'botón editar objetivo de ahorro',
        },
        {
            route: '/(tabs)/savings/history',
            label: 'Ver historial de ahorro',
            color: 'bg-gray-800',
            icon: 'time-outline',
            a11y: 'botón historial de ahorro',
        },
        {
            route: '/(tabs)/savings/suggestions',
            label: 'Ver sugerencias de ahorro',
            color: 'bg-teal-600',
            icon: 'bulb-outline',
            a11y: 'botón sugerencias de ahorro',
        },
    ];
    return (
        <View className="flex-1 bg-white p-6">
            <Text className="text-xl font-bold mb-6 text-center text-neutral-800">
                {currentGoal?.title ?? 'Ahorro total'}
            </Text>

            {currentGoal ? (
                <View className="mb-8">
                    <Text className="text-base font-semibold text-center mb-2 text-neutral-700">
                        Progreso de tu meta: {Math.round(progress * 100)}%
                    </Text>
                    <View className="h-4 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-green-500"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </View>
                </View>
            ) : (
                <View className="mb-8">
                    <Text className="text-base font-semibold text-center text-neutral-700">
                        Ahorro total acumulado:{' '}
                        {totalSavings ? parseFloat(totalSavings).toFixed(2) : 0}{' '}
                        €
                    </Text>
                </View>
            )}
            {buttons.map((btn) => (
                <TouchableOpacity
                    key={btn.route}
                    accessibilityLabel={btn.a11y}
                    onPress={() => router.push(btn.route)}
                    className={`${btn.color} flex-row items-center justify-between p-4 rounded-xl mb-4`}
                >
                    <Text className="text-white text-lg font-semibold">
                        {btn.label}
                    </Text>
                    <Ionicons name={btn.icon as any} size={24} color="white" />
                </TouchableOpacity>
            ))}
        </View>
    );
}
