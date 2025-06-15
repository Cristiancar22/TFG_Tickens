import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { SavingsGoal } from '@/types';

type Props = {
    goal: SavingsGoal;
};

export const SavingsGoalItem: React.FC<Props> = ({ goal }) => {
    const percentage = Math.min(
        (goal.accumulatedAmount / goal.targetAmount) * 100,
        100,
    );

    return (
        <View
            style={{
                backgroundColor: '#fff',
                marginHorizontal: 16,
                marginVertical: 8,
                padding: 16,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: 8,
                }}
            >
                {goal.title}
            </Text>

            <Text style={{ color: colors.foreground, marginBottom: 4 }}>
                Objetivo: {goal.targetAmount.toFixed(2)} €
            </Text>
            <Text style={{ color: colors.foreground, marginBottom: 8 }}>
                Ahorrado: {goal.accumulatedAmount.toFixed(2)} €
            </Text>

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
                        backgroundColor: colors.primary,
                    }}
                />
            </View>
        </View>
    );
};
