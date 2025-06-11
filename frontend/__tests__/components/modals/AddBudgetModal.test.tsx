import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { Budget } from '@/types';
import { AddBudgetModal } from '@/components/modals/AddBudgetModal';

describe('AddBudgetModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnDelete = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza correctamente el modo "nuevo presupuesto"', () => {
        const { getByLabelText, queryByLabelText } = render(
            <AddBudgetModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        expect(getByLabelText('add-budget-title').props.children).toBe(
            'Nuevo presupuesto',
        );
        expect(getByLabelText('add-budget-limit-input')).toBeTruthy();
        expect(getByLabelText('add-budget-submit-button')).toBeTruthy();
        expect(getByLabelText('add-budget-cancel-button')).toBeTruthy();
        expect(queryByLabelText('add-budget-delete-button')).toBeNull();
    });

    it('renderiza correctamente el modo "editar presupuesto"', () => {
        const mockBudget: Budget = {
            id: '1',
            limitAmount: 150,
            isRecurring: true,
            isActive: true,
            notificationsEnabled: true,
            month: 5,
            year: 2025,
            category: {
                _id: 'cat123',
                name: 'Ocio',
            },
        };

        const { getByLabelText } = render(
            <AddBudgetModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                onDelete={mockOnDelete}
                budget={mockBudget}
            />,
        );

        expect(getByLabelText('add-budget-title').props.children).toBe(
            'Editar presupuesto',
        );
        expect(getByLabelText('add-budget-limit-input').props.value).toBe(
            '150',
        );
        expect(getByLabelText('add-budget-delete-button')).toBeTruthy();
    });

    it('llama a onSubmit y onClose al pulsar guardar con datos válidos', () => {
        const { getByLabelText } = render(
            <AddBudgetModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        fireEvent.changeText(getByLabelText('add-budget-limit-input'), '200');
        fireEvent.press(getByLabelText('add-budget-submit-button'));

        expect(mockOnSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                limitAmount: 200,
                isRecurring: true,
                isActive: true,
                notificationsEnabled: true,
                category: undefined,
            }),
        );

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('no llama a onSubmit si el input está vacío', () => {
        const { getByLabelText } = render(
            <AddBudgetModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        fireEvent.press(getByLabelText('add-budget-submit-button'));
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('llama a onClose al pulsar cancelar', () => {
        const { getByLabelText } = render(
            <AddBudgetModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        fireEvent.press(getByLabelText('add-budget-cancel-button'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('llama a onDelete tras confirmar eliminación', () => {
        const alertMock = jest
            .spyOn(Alert, 'alert')
            .mockImplementation((_, __, buttons) => {
                const eliminar = buttons?.find(
                    (b) => b.style === 'destructive',
                );
                eliminar?.onPress?.();
            });

        const { getByLabelText } = render(
            <AddBudgetModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                onDelete={mockOnDelete}
                budget={{
                    id: '1',
                    limitAmount: 100,
                    isRecurring: false,
                    isActive: true,
                    notificationsEnabled: true,
                    month: 1,
                    year: 2025,
                }}
            />,
        );

        fireEvent.press(getByLabelText('add-budget-delete-button'));

        expect(mockOnDelete).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();

        alertMock.mockRestore();
    });
});
