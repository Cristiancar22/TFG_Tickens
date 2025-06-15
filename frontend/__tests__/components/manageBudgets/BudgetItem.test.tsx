import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Budget } from '@/types';
import { BudgetItem } from '@/components/manageBudgets/BudgetItem';

const fakeBudget: Budget = {
    _id: 'mock-id',
    id: '1',
    isActive: true,
    isRecurring: true,
    limitAmount: 100,
    month: 1,
    notificationsEnabled: true,
    spentAmount: 0,
    user: 'mock-user-id',
    year: 2025,
    category: {
        _id: 'cat1',
        name: 'Comida',
        icon: 'restaurant',
        primaryColor: '#FF0000',
        secondaryColor: '#FFFF00',
    },
};

describe('BudgetItem', () => {
    it('renderiza correctamente los datos del presupuesto con categoría', () => {
        const { getByLabelText } = render(<BudgetItem budget={fakeBudget} />);

        expect(getByLabelText('budget-item-1')).toBeTruthy();
        expect(getByLabelText('budget-name-1').props.children).toBe('Comida');
        expect(
            getByLabelText('budget-limit-1').props.children.join(''),
        ).toContain('100.00');
        expect(
            getByLabelText('budget-spent-1').props.children.join(''),
        ).toContain('0.00');
        expect(getByLabelText('budget-progress-1')).toBeTruthy();
    });

    it('renderiza correctamente con categoría indefinida', () => {
        const budgetWithoutCategory: Budget = {
            ...fakeBudget,
            id: '2',
            category: undefined,
        };

        const { getByLabelText } = render(
            <BudgetItem budget={budgetWithoutCategory} />,
        );

        expect(getByLabelText('budget-item-2')).toBeTruthy();
        expect(getByLabelText('budget-name-2').props.children).toBe('General');
    });

    it('llama a onEdit al pulsar si está definido', () => {
        const mockEdit = jest.fn();
        const { getByLabelText } = render(
            <BudgetItem budget={fakeBudget} onEdit={mockEdit} />,
        );

        fireEvent.press(getByLabelText('budget-item-1'));
        expect(mockEdit).toHaveBeenCalledWith(fakeBudget);
    });

    it('no lanza error si no se pasa onEdit', () => {
        const { getByLabelText } = render(<BudgetItem budget={fakeBudget} />);
        expect(() =>
            fireEvent.press(getByLabelText('budget-item-1')),
        ).not.toThrow();
    });
});
