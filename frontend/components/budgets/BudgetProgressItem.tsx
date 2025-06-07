import React from 'react';
import { View, Text } from 'react-native';
import { VictoryPie, VictoryTheme } from 'victory-native';
import { Budget } from '@/types';
import { colors } from '@/constants/colors';

type Props = {
    budget: Budget;
};

export const BudgetProgressItem: React.FC<Props> = ({ budget }) => {
    const percentage = Math.min(
        (budget.spentAmount / budget.limitAmount) * 100,
        100,
    );

    const primaryColor = budget.category?.primaryColor || colors.accent;

    return (
        <View
            style={{
                backgroundColor: '#fff',
                padding: 16,
                marginBottom: 12,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 3,
                alignItems: 'center',
                height: 230,
                overflow: 'visible',
            }}
        >
            <VictoryPie
                data={[
                    { x: 'gastado', y: percentage },
                    { x: 'restante', y: 100 - percentage },
                ]}
                colorScale={[primaryColor, '#eee']}
                innerRadius={20}
                labelRadius={45}
                radius={40}
                padAngle={2}
                animate={{
                    duration: 500,
                    easing: 'quadInOut',

                }}
                theme={VictoryTheme.clean}

                labels={({ datum }) =>
                    datum.x === 'gastado' ? `${percentage.toFixed(0)}%` : ''
                }

                style={{
                    labels: {
                        fontSize: 16,
                        fill: colors.text,
                        fontWeight: 'bold',
                    },
                }}
                width={160}
                height={120}
            />

            <Text
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.text,
                    marginTop: 8,
                    height: 50,
                }}
            >
                {budget.category ? budget.category.name : 'General'}
            </Text>

            <Text
                style={{
                    color: colors.foreground,
                    fontSize: 14,
                    marginTop: 4,
                }}
            >
                {budget.spentAmount.toFixed(2)} € /{' '}
                {budget.limitAmount.toFixed(2)} €
            </Text>
        </View>
    );
};
