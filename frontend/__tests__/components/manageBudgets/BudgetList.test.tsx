import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BudgetList } from '@/components/manageBudgets/BudgetList';
import { useBudgets } from '@/store/useBudgets';
import { Budget } from '@/types';

jest.mock('@/store/useBudgets');
const mockedUseBudgets = useBudgets as jest.Mock;

const fakeBudgets: Budget[] = [
    {
        _id: 'b1',
        id: 'b1',
        user: 'u1',
        isActive: true,
        isRecurring: false,
        notificationsEnabled: true,
        month: 6,
        year: 2025,
        limitAmount: 100,
        spentAmount: 40,
        category: {
            _id: 'cat1',
            name: 'Comida',
            icon: 'restaurant',
            primaryColor: '#FF0000',
            secondaryColor: '#FFFF00',
        },
    },
    {
        _id: 'b2',
        id: 'b2',
        user: 'u1',
        isActive: true,
        isRecurring: true,
        notificationsEnabled: false,
        month: 6,
        year: 2025,
        limitAmount: 200,
        spentAmount: 120,
        category: {
            _id: 'cat2',
            name: 'Ocio',
            icon: 'game-controller',
            primaryColor: '#00FF00',
            secondaryColor: '#000000',
        },
    },
];

const withBudgets = (budgets: Budget[]) =>
    mockedUseBudgets.mockImplementation((selector) => selector({ budgets }));

describe('BudgetList', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza la lista de presupuestos correctamente', () => {
        withBudgets(fakeBudgets);

        const mockOnEdit = jest.fn();
        const { getByLabelText } = render(
            <BudgetList onEditBudget={mockOnEdit} />
        );

        expect(getByLabelText('budget-list')).toBeTruthy();
        expect(getByLabelText('budget-item-b1')).toBeTruthy();
        expect(getByLabelText('budget-item-b2')).toBeTruthy();
    });

    it('llama al callback onEditBudget al pulsar un presupuesto', () => {
        withBudgets(fakeBudgets);

        const mockOnEdit = jest.fn();
        const { getByLabelText } = render(
            <BudgetList onEditBudget={mockOnEdit} />
        );

        fireEvent.press(getByLabelText('budget-item-b2'));
        expect(mockOnEdit).toHaveBeenCalledWith(fakeBudgets[1]);
    });
});
