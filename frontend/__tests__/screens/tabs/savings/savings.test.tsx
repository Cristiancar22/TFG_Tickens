import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { useSavingsGoalStore } from '@/store/useSavingsGoal';
import SavingsHomeScreen from '@/app/(tabs)/index/savings';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/store/useSavingsGoal', () => ({
    useSavingsGoalStore: jest.fn(),
}));

describe('SavingsHomeScreen', () => {
    const mockPush = jest.fn();
    const mockFetchCurrentGoal = jest.fn();
    const mockFetchTotalSavings = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        jest.clearAllMocks();
    });

    it('muestra el título del objetivo y el progreso si hay currentGoal', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: {
                title: 'Viaje a Japón',
                accumulatedAmount: 300,
                targetAmount: 1000,
            },
            totalSavings: null,
            fetchCurrentGoal: mockFetchCurrentGoal,
            fetchTotalSavings: mockFetchTotalSavings,
        });

        const { getByText } = render(<SavingsHomeScreen />);

        expect(getByText('Viaje a Japón')).toBeTruthy();
        expect(getByText('Progreso de tu meta: 30%')).toBeTruthy();
    });

    it('muestra el ahorro total si no hay currentGoal', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            totalSavings: '275.50',
            fetchCurrentGoal: mockFetchCurrentGoal,
            fetchTotalSavings: mockFetchTotalSavings,
        });

        const { getByText } = render(<SavingsHomeScreen />);

        expect(getByText('Ahorro total')).toBeTruthy();
        expect(getByText('Ahorro total acumulado: 275.50 €')).toBeTruthy();
    });

    it('renderiza todos los botones correctamente', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            totalSavings: '0',
            fetchCurrentGoal: mockFetchCurrentGoal,
            fetchTotalSavings: mockFetchTotalSavings,
        });

        const { getByLabelText } = render(<SavingsHomeScreen />);

        expect(getByLabelText('botón editar objetivo de ahorro')).toBeTruthy();
        expect(getByLabelText('botón historial de ahorro')).toBeTruthy();
        expect(getByLabelText('botón sugerencias de ahorro')).toBeTruthy();
    });

    it('navega a la ruta correcta al presionar los botones', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            totalSavings: '0',
            fetchCurrentGoal: mockFetchCurrentGoal,
            fetchTotalSavings: mockFetchTotalSavings,
        });

        const { getByLabelText } = render(<SavingsHomeScreen />);

        fireEvent.press(getByLabelText('botón editar objetivo de ahorro'));
        expect(mockPush).toHaveBeenCalledWith('/(tabs)/savings/editGoal');

        fireEvent.press(getByLabelText('botón historial de ahorro'));
        expect(mockPush).toHaveBeenCalledWith('/(tabs)/savings/history');

        fireEvent.press(getByLabelText('botón sugerencias de ahorro'));
        expect(mockPush).toHaveBeenCalledWith('/(tabs)/savings/suggestions');
    });

    it('llama a las funciones de fetch al montar', () => {
        (useSavingsGoalStore as jest.Mock).mockReturnValue({
            currentGoal: null,
            totalSavings: '0',
            fetchCurrentGoal: mockFetchCurrentGoal,
            fetchTotalSavings: mockFetchTotalSavings,
        });

        render(<SavingsHomeScreen />);
        expect(mockFetchCurrentGoal).toHaveBeenCalled();
        expect(mockFetchTotalSavings).toHaveBeenCalled();
    });
});
