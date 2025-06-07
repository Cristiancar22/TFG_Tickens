import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { Budget } from '@/types';

type Props = {
    budget: Budget;
    onEdit?: (budget: Budget) => void; // ✅ ahora es opcional
};

export const BudgetItem: React.FC<Props> = ({ budget, onEdit }) => {
    const primaryColor = budget.category?.primaryColor || colors.primary;
    const secondaryColor = budget.category?.secondaryColor || '#FEFEFE';
    const iconName = budget.category?.icon || 'wallet-outline';

    const percentage = Math.min(
        (budget.spentAmount / budget.limitAmount) * 100,
        100,
    );
    const progressColor = percentage >= 100 ? colors.danger : secondaryColor;

    const Container = onEdit ? TouchableOpacity : View;

    return (
        <Container
            onPress={onEdit ? () => onEdit(budget) : undefined}
            style={{
                backgroundColor: '#fff',
                marginHorizontal: 16,
                marginVertical: 8,
                padding: 16,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <View
                    style={{
                        backgroundColor: secondaryColor,
                        borderRadius: 20,
                        padding: 8,
                        marginRight: 12,
                    }}
                >
                    <Ionicons
                        name={iconName as any}
                        size={24}
                        color={primaryColor}
                    />
                </View>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.text,
                    }}
                >
                    {budget.category ? budget.category.name : 'General'}
                </Text>
            </View>

            <View style={{ marginBottom: 8 }}>
                <Text style={{ color: colors.foreground, fontSize: 14 }}>
                    Límite: {budget.limitAmount.toFixed(2)} €
                </Text>
                <Text style={{ color: colors.foreground, fontSize: 14 }}>
                    Gastado: {budget.spentAmount.toFixed(2)} €
                </Text>
            </View>

            {/* Progress Bar */}
            <View
                style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#eee',
                    overflow: 'hidden',
                }}
            >
                <View
                    style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor:
                            progressColor === '#FEFEFE'
                                ? primaryColor
                                : progressColor,
                    }}
                />
            </View>
        </Container>
    );
};
