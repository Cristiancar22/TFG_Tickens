import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useBudgets } from '@/store/useBudgets';
import ManageBudgetsScreen from '@/app/(tabs)/index/manageBudgets';

jest.mock('@/store/useBudgets', () => ({
    useBudgets: jest.fn(),
}));

jest.mock('@/components/manageBudgets/BudgetList', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return {
        BudgetList: ({ onEditBudget }: any) => {
            return (
                <View accessibilityLabel="budget-list">
                    <Text>Lista de presupuestos</Text>
                    <TouchableOpacity
                        accessibilityLabel="edit-budget-button"
                        onPress={() =>
                            onEditBudget({
                                id: '1',
                                amount: 200,
                                month: 6,
                                year: 2025,
                            })
                        }
                    >
                        <Text>Editar</Text>
                    </TouchableOpacity>
                </View>
            );
        },
    };
});

jest.mock('@/components/modals/AddBudgetModal', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return {
        AddBudgetModal: ({
            isVisible,
            onClose,
            onDelete,
            onSubmit,
        }: any) => {
            if (!isVisible) return null;

            return (
                <View accessibilityLabel="add-budget-modal">
                    <Text>Modal Presupuesto</Text>
                    <TouchableOpacity
                        accessibilityLabel="submit-budget"
                        onPress={() =>
                            onSubmit({ amount: 500, month: 6, year: 2025 })
                        }
                    >
                        <Text>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityLabel="delete-budget"
                        onPress={onDelete}
                    >
                        <Text>Eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityLabel="close-modal"
                        onPress={onClose}
                    >
                        <Text>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            );
        },
    };
});

describe('ManageBudgetsScreen', () => {
    const mockCreate = jest.fn();
    const mockUpdate = jest.fn();
    const mockDelete = jest.fn();
    const mockFetch = jest.fn();

    beforeEach(() => {
        (useBudgets as jest.Mock).mockImplementation((selector: any) =>
            selector({
                createBudget: mockCreate,
                updateBudget: mockUpdate,
                deleteBudget: mockDelete,
                fetchBudgets: mockFetch,
            }),
        );
        jest.clearAllMocks();
    });

    it('renderiza los elementos principales', () => {
        const { getByLabelText } = render(<ManageBudgetsScreen />);
        expect(getByLabelText('manage-budgets-screen')).toBeTruthy();
        expect(getByLabelText('budget-list')).toBeTruthy();
        expect(getByLabelText('add-budget-button')).toBeTruthy();
    });

    it('abre el modal al presionar el botón flotante', () => {
        const { getByLabelText, queryByLabelText } = render(
            <ManageBudgetsScreen />,
        );
        expect(queryByLabelText('add-budget-modal')).toBeNull();

        fireEvent.press(getByLabelText('add-budget-button'));

        expect(getByLabelText('add-budget-modal')).toBeTruthy();
    });

    it('edita un presupuesto al hacer clic en editar', async () => {
        const { getByLabelText } = render(<ManageBudgetsScreen />);
        fireEvent.press(getByLabelText('edit-budget-button'));
        expect(getByLabelText('add-budget-modal')).toBeTruthy();

        fireEvent.press(getByLabelText('submit-budget'));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith('1', {
                amount: 500,
                month: 6,
                year: 2025,
            });
        });
    });

    it('elimina un presupuesto desde el modal', async () => {
        const { getByLabelText } = render(<ManageBudgetsScreen />);
        fireEvent.press(getByLabelText('edit-budget-button'));
        fireEvent.press(getByLabelText('delete-budget'));

        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalledWith('1');
        });
    });

    it('cierra el modal al pulsar cerrar', () => {
        const { getByLabelText, queryByLabelText } = render(
            <ManageBudgetsScreen />,
        );
        fireEvent.press(getByLabelText('add-budget-button'));
        expect(getByLabelText('add-budget-modal')).toBeTruthy();

        fireEvent.press(getByLabelText('close-modal'));
        expect(queryByLabelText('add-budget-modal')).toBeNull();
    });

    it('llama a fetchBudgets al montar', () => {
        render(<ManageBudgetsScreen />);
        expect(mockFetch).toHaveBeenCalled();
    });
});
