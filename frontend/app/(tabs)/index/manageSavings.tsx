import { useEffect, useState } from 'react';
import { Text, FlatList, Alert, View, ActivityIndicator } from 'react-native';

import { colors } from '@/constants/colors';
import { PeriodNavigator } from '@/components/stats/PeriodNavigator';
import { BudgetItem } from '@/components/manageBudgets/BudgetItem';
import { getBudgets } from '@/services/budget.service';
import { Budget } from '@/types';

const ManageSavingsScreen = () => {
    const [currentDate, setCurrentDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d;
    });

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(false);

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getBudgets(month, year);
            setBudgets(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudieron cargar los presupuestos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month, year]);

    const calculateTotalSavings = () => {
        return budgets.reduce((total, budget) => {
            const diff = budget.limitAmount - budget.spentAmount;
            return total + diff;
        }, 0);
    };

    return (
        <View className="flex-1 p-4 bg-white">
            <PeriodNavigator
                viewType="monthly"
                currentDate={currentDate}
                setCurrentDate={(newDate) => {
                    const today = new Date();
                    if (
                        newDate.getFullYear() > today.getFullYear() ||
                        (newDate.getFullYear() === today.getFullYear() &&
                            newDate.getMonth() >= today.getMonth())
                    ) {
                        return;
                    }
                    setCurrentDate(newDate);
                }}
            />

            <Text
                style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 16,
                    textAlign: 'center',
                }}
            >
                {`Este mes has ${
                    calculateTotalSavings() >= 0 ? 'ahorrado' : 'gastado de más'
                } ${Math.abs(calculateTotalSavings()).toFixed(2)} €`}
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <FlatList
                    data={budgets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <BudgetItem budget={item} />
                    )}
                    contentContainerStyle={{ paddingBottom: 32 }}
                />
            )}
        </View>
    );
};

export default ManageSavingsScreen;
