import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { useSavingsGoalStore } from '@/store/useSavingsGoal';
import EditGoalScreen from '@/app/(tabs)/index/savings/editGoal';
import { Alert } from 'react-native';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/store/useSavingsGoal', () => ({
    useSavingsGoalStore: jest.fn(),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
}));

describe('EditGoalScreen', () => {
    const mockRouterBack = jest.fn();
    const mockUpdateGoal = jest.fn();
    const mockCreateGoal = jest.fn();
    const mockFetch = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ back: mockRouterBack });
        jest.clearAllMocks();
    });

    it('muestra loading si está cargando', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            loading: true,
            fetchCurrentGoal: mockFetch,
            updateGoal: mockUpdateGoal,
            createGoal: mockCreateGoal,
        });

        const { getByTestId } = render(<EditGoalScreen />);
        expect(getByTestId('ActivityIndicator')).toBeTruthy();
    });

    it('renderiza correctamente sin currentGoal (modo creación)', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            loading: false,
            fetchCurrentGoal: mockFetch,
            updateGoal: mockUpdateGoal,
            createGoal: mockCreateGoal,
        });

        const { getByText, getByPlaceholderText } = render(<EditGoalScreen />);
        expect(getByText('Crear objetivo de ahorro')).toBeTruthy();
        expect(getByPlaceholderText('Ej. Viaje a Japón')).toBeTruthy();
        expect(getByPlaceholderText('1500')).toBeTruthy();
    });

    it('renderiza correctamente con currentGoal (modo edición)', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: {
                id: '1',
                title: 'Meta prueba',
                targetAmount: 800,
            },
            loading: false,
            fetchCurrentGoal: mockFetch,
            updateGoal: mockUpdateGoal,
            createGoal: mockCreateGoal,
        });

        const { getByDisplayValue, getByText } = render(<EditGoalScreen />);
        expect(getByDisplayValue('Meta prueba')).toBeTruthy();
        expect(getByDisplayValue('800')).toBeTruthy();
        expect(getByText('Editar objetivo de ahorro')).toBeTruthy();
        expect(getByText('Crear nueva meta (cerrar la actual)')).toBeTruthy();
    });

    it('muestra alerta si campos están vacíos', async () => {
        const alertMock = jest.spyOn(Alert, 'alert');

        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            loading: false,
            fetchCurrentGoal: mockFetch,
            updateGoal: mockUpdateGoal,
            createGoal: mockCreateGoal,
        });

        const { getByText } = render(<EditGoalScreen />);
        fireEvent.press(getByText('Guardar'));

        await waitFor(() =>
            expect(alertMock).toHaveBeenCalledWith(
                'Campos obligatorios',
                'Título y cantidad son requeridos',
            ),
        );
    });

    it('crea nueva meta cuando no hay currentGoal', async () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            loading: false,
            fetchCurrentGoal: mockFetch,
            updateGoal: mockUpdateGoal,
            createGoal: mockCreateGoal,
        });

        const { getByText, getByPlaceholderText } = render(<EditGoalScreen />);
        fireEvent.changeText(
            getByPlaceholderText('Ej. Viaje a Japón'),
            'Ahorro coche',
        );
        fireEvent.changeText(getByPlaceholderText('1500'), '1200');
        fireEvent.press(getByText('Guardar'));

        await waitFor(() =>
            expect(mockCreateGoal).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Ahorro coche',
                    targetAmount: 1200,
                }),
            ),
        );
        expect(mockRouterBack).toHaveBeenCalled();
    });

    it('actualiza la meta actual cuando hay currentGoal', async () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: { id: '1', title: 'Meta vieja', targetAmount: 400 },
            loading: false,
            fetchCurrentGoal: mockFetch,
            updateGoal: mockUpdateGoal,
            createGoal: mockCreateGoal,
        });

        const { getByText, getByDisplayValue } = render(<EditGoalScreen />);
        fireEvent.changeText(getByDisplayValue('Meta vieja'), 'Meta nueva');
        fireEvent.changeText(getByDisplayValue('400'), '900');
        fireEvent.press(getByText('Guardar'));

        await waitFor(() =>
            expect(mockUpdateGoal).toHaveBeenCalledWith('1', {
                title: 'Meta nueva',
                targetAmount: 900,
            }),
        );
        expect(mockRouterBack).toHaveBeenCalled();
    });

    it('cierra la meta y crea una nueva con el botón extra', async () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: { id: '1', title: 'Meta vieja', targetAmount: 400 },
            loading: false,
            fetchCurrentGoal: mockFetch,
            updateGoal: mockUpdateGoal,
            createGoal: mockCreateGoal,
        });

        const { getByText } = render(<EditGoalScreen />);
        fireEvent.press(getByText('Crear nueva meta (cerrar la actual)'));

        await waitFor(() => {
            expect(mockUpdateGoal).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({ isActive: false }),
            );
            expect(mockCreateGoal).toHaveBeenCalled();
            expect(mockRouterBack).toHaveBeenCalled();
        });
    });
});
