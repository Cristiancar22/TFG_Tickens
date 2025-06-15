import React from 'react';
import { render } from '@testing-library/react-native';
import { BudgetProgressItem } from '@/components/budgets';
import { victoryPieMock } from '@/__mocks__/victory-native';
import { Budget } from '@/types';
import { createMockBudget } from '@/__tests__/helpers';

describe('BudgetProgressItem', () => {
    beforeEach(() => {
        victoryPieMock.mockClear();
    });

    it('renderiza el nombre de la categoría y el texto de presupuesto', () => {
        const budget = createMockBudget({
            spentAmount: 50,
            limitAmount: 100,
            category: {
                name: 'Comida',
                secondaryColor: '#ff0000',
            } as Budget['category'],
        });

        const { getByText } = render(<BudgetProgressItem budget={budget} />);

        expect(getByText('Comida')).toBeTruthy();
        expect(getByText('50.00 € / 100.00 €')).toBeTruthy();
    });

    it('muestra "General" si no hay categoría', () => {
        const budget = createMockBudget({
            spentAmount: 50,
            limitAmount: 100,
            category: undefined,
        });

        const { getByText } = render(<BudgetProgressItem budget={budget} />);
        expect(getByText('General')).toBeTruthy();
    });

    it('calcula correctamente el porcentaje para VictoryPie', () => {
        const budget = createMockBudget({
            spentAmount: 30,
            limitAmount: 60,
            category: undefined,
        });

        render(<BudgetProgressItem budget={budget} />);

        const pieProps = victoryPieMock.mock.calls[0][0];
        expect(pieProps.data).toEqual([
            { x: 'gastado', y: 50 },
            { x: 'restante', y: 50 },
        ]);
        expect(pieProps.colorScale[0]).toBeDefined();
    });

    it('cappea el porcentaje al 100% si se pasa del límite', () => {
        const budget = createMockBudget({
            spentAmount: 200,
            limitAmount: 100,
            category: undefined,
        });

        render(<BudgetProgressItem budget={budget} />);
        const pieProps = victoryPieMock.mock.calls[0][0];
        expect(pieProps.data).toEqual([
            { x: 'gastado', y: 100 },
            { x: 'restante', y: 0 },
        ]);
    });
});
