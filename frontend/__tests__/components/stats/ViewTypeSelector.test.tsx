import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ViewTypeSelector } from '@/components/stats/ViewTypeSelector';

describe('ViewTypeSelector', () => {
    it('renderiza ambos botones correctamente', () => {
        const { getByLabelText } = render(
            <ViewTypeSelector viewType="monthly" setViewType={jest.fn()} />,
        );

        expect(getByLabelText('view-type-monthly-button')).toBeTruthy();
        expect(getByLabelText('view-type-annual-button')).toBeTruthy();
        expect(getByLabelText('view-type-monthly-label').props.children).toBe(
            'Mensual',
        );
        expect(getByLabelText('view-type-annual-label').props.children).toBe(
            'Anual',
        );
    });

    it('aplica el estilo activo al botón mensual si viewType es monthly', () => {
        const { getByLabelText } = render(
            <ViewTypeSelector viewType="monthly" setViewType={jest.fn()} />,
        );

        const monthlyLabel = getByLabelText('view-type-monthly-label');
        expect(monthlyLabel.props.style.fontWeight).toBe('600');
    });

    it('llama a setViewType con "annual" al pulsar ese botón', () => {
        const mockSetViewType = jest.fn();
        const { getByLabelText } = render(
            <ViewTypeSelector
                viewType="monthly"
                setViewType={mockSetViewType}
            />,
        );

        fireEvent.press(getByLabelText('view-type-annual-button'));
        expect(mockSetViewType).toHaveBeenCalledWith('annual');
    });

    it('llama a setViewType con "monthly" al pulsar ese botón', () => {
        const mockSetViewType = jest.fn();
        const { getByLabelText } = render(
            <ViewTypeSelector
                viewType="annual"
                setViewType={mockSetViewType}
            />,
        );

        fireEvent.press(getByLabelText('view-type-monthly-button'));
        expect(mockSetViewType).toHaveBeenCalledWith('monthly');
    });
});
