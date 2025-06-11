import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PeriodNavigator } from '@/components/stats/PeriodNavigator';

describe('PeriodNavigator', () => {
    const baseDate = new Date(2024, 5, 1);
    let currentDate: Date;
    let setCurrentDate: jest.Mock;

    beforeEach(() => {
        currentDate = new Date(baseDate);
        setCurrentDate = jest.fn();
    });

    it('renderiza correctamente con vista mensual', () => {
        const { getByLabelText } = render(
            <PeriodNavigator
                viewType="monthly"
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />
        );

        expect(getByLabelText('period-label')).toBeTruthy();
        expect(getByLabelText('period-prev-button')).toBeTruthy();
        expect(getByLabelText('period-next-button')).toBeTruthy();
    });

    it('retrocede un mes al pulsar el botón previo (mensual)', () => {
        const { getByLabelText } = render(
            <PeriodNavigator
                viewType="monthly"
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />
        );

        fireEvent.press(getByLabelText('period-prev-button'));
        expect(setCurrentDate).toHaveBeenCalledWith(new Date(2024, 4, 1)); // mayo
    });

    it('avanza un mes si está dentro del límite (mensual)', () => {
        const { getByLabelText } = render(
            <PeriodNavigator
                viewType="monthly"
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />
        );

        fireEvent.press(getByLabelText('period-next-button'));
        expect(setCurrentDate).toHaveBeenCalledWith(new Date(2024, 6, 1)); // julio
    });

    it('no avanza si se supera el límite de 6 meses en el futuro (mensual)', () => {
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 6);
        const { getByLabelText } = render(
            <PeriodNavigator
                viewType="monthly"
                currentDate={futureDate}
                setCurrentDate={setCurrentDate}
            />
        );

        fireEvent.press(getByLabelText('period-next-button'));
        expect(setCurrentDate).not.toHaveBeenCalled();
    });

    it('retrocede un año (anual)', () => {
        const { getByLabelText } = render(
            <PeriodNavigator
                viewType="annual"
                currentDate={new Date(2025, 0, 1)}
                setCurrentDate={setCurrentDate}
            />
        );

        fireEvent.press(getByLabelText('period-prev-button'));
        expect(setCurrentDate).toHaveBeenCalledWith(new Date(2024, 0, 1));
    });

    it('avanza un año si es menor o igual al actual (anual)', () => {
        const thisYear = new Date().getFullYear();
        const { getByLabelText } = render(
            <PeriodNavigator
                viewType="annual"
                currentDate={new Date(thisYear - 1, 0, 1)}
                setCurrentDate={setCurrentDate}
            />
        );

        fireEvent.press(getByLabelText('period-next-button'));
        expect(setCurrentDate).toHaveBeenCalledWith(new Date(thisYear, 0, 1));
    });

    it('no avanza si el año supera al actual (anual)', () => {
        const futureYear = new Date().getFullYear() + 1;
        const { getByLabelText } = render(
            <PeriodNavigator
                viewType="annual"
                currentDate={new Date(futureYear, 0, 1)}
                setCurrentDate={setCurrentDate}
            />
        );

        fireEvent.press(getByLabelText('period-next-button'));
        expect(setCurrentDate).not.toHaveBeenCalled();
    });
});
