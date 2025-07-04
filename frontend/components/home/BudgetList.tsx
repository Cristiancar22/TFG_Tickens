import { View, Text } from 'react-native';
import { useBudgets } from '@/store/useBudgets';
import { BudgetProgressItem } from '@/components/budgets';

export const BudgetList = () => {
    const budgets = useBudgets((s) => s.budgets);

    return (
        <View className="bg-white p-4 rounded-xl shadow mb-6">
            <Text
                className="text-lg text-foreground mb-4"
                accessibilityLabel="budget-list-title"
            >
                Presupuestos del mes
            </Text>

            {budgets.length === 0 ? (
                <Text
                    className="text-center text-foreground"
                    accessibilityLabel="no-budgets"
                >
                    No hay presupuestos
                </Text>
            ) : (
                <View
                    accessibilityLabel="budget-list-container"
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    {budgets.map((budget) => (
                        <View
                            key={budget.id}
                            accessibilityLabel={`budget-item-${budget.id}`}
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
    );
};
