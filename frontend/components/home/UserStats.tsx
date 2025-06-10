import { View, Text } from 'react-native';
import { useUserStats } from '@/store/useUserStats';

export const UserStats = () => {
    const { stats } = useUserStats();

    return (
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
    );
};
