import { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { SavingsGoalItem } from '@/components/savings/SavingsGoalItem';
import { SavingsGoal } from '@/types';
import { getAllSavingsGoals } from '@/services/savings.service';

export default function SavingsGoalsHistoryScreen() {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const all = await getAllSavingsGoals();
                setGoals(all);
            } catch (err) {
                Alert.alert(
                    'Error',
                    'No se pudieron cargar las metas de ahorro',
                );
            } finally {
                setLoading(false);
            }
        };
        loadGoals();
    }, []);

    return (
        <View className="flex-1 bg-white pt-4">
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <FlatList
                    data={goals}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <SavingsGoalItem goal={item} />}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    ListEmptyComponent={() => (
                        <Text className="text-center text-neutral-500 mt-8">
                            No tienes metas anteriores aún.
                        </Text>
                    )}
                />
            )}
        </View>
    );
}
