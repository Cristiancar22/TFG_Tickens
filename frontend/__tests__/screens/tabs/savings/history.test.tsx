import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { getBudgets } from '@/services/budget.service';
import { Alert } from 'react-native';
import SavingsHistoryScreen from '@/app/(tabs)/index/savings/history';

jest.mock('@/services/budget.service', () => ({
    getBudgets: jest.fn(),
}));

jest.mock('@/components/stats/PeriodNavigator', () => {
    const { Text } = require('react-native');
    return {
        PeriodNavigator: ({ currentDate }: any) => {
            return <Text>PeriodNavigator: {currentDate.toString()}</Text>;
        },
    };
});

jest.mock('@/components/manageBudgets/BudgetItem', () => {
    const { Text } = require('react-native');
    return {
        BudgetItem: ({ budget }: any) => (
            <Text accessibilityLabel={`budget-item-${budget.id}`}>
                {budget.category?.name || 'Sin categoría'}: {budget.limitAmount}
                €
            </Text>
        ),
    };
});

describe('SavingsHistoryScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('muestra el indicador de carga mientras se obtienen los datos', async () => {
        (getBudgets as jest.Mock).mockImplementation(
            () => new Promise(() => {}),
        );

        const { getByTestId } = render(<SavingsHistoryScreen />);

        expect(getByTestId('ActivityIndicator')).toBeTruthy();
    });

    it('muestra los presupuestos después de la carga', async () => {
        (getBudgets as jest.Mock).mockResolvedValue([
            {
                id: '1',
                category: { name: 'Comida' },
                limitAmount: 200,
                spentAmount: 150,
            },
            {
                id: '2',
                category: null,
                limitAmount: 300,
                spentAmount: 100,
            },
        ]);

        const { getByText, getByLabelText, queryByTestId } = render(
            <SavingsHistoryScreen />,
        );

        await waitFor(() => {
            expect(queryByTestId('ActivityIndicator')).toBeNull();
        });

        expect(getByLabelText('budget-item-1')).toBeTruthy();
        expect(getByLabelText('budget-item-2')).toBeTruthy();

        expect(getByText('Este mes has ahorrado 200.00 €')).toBeTruthy();
    });

    it('muestra mensaje de error si falla la carga', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        (getBudgets as jest.Mock).mockRejectedValue(new Error('error'));

        const alertSpy = jest.spyOn(Alert, 'alert');

        render(<SavingsHistoryScreen />);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                'Error',
                'No se pudieron cargar los presupuestos',
            );
        });
    });
});
