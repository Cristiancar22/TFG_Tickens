import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionFilter } from '@/components/transactions/TransactionFilter';

jest.mock('@ptomasroos/react-native-multi-slider', () => {
    return ({ onValuesChange }: any) => {
        return <MockSlider onValuesChange={onValuesChange} />;
    };
});

const MockSlider = ({
    onValuesChange,
}: {
    onValuesChange: (val: number[]) => void;
}) => {
    return (
        <View accessibilityLabel="price-slider-mock">
            <Text testID="mock-slider" onPress={() => onValuesChange([15, 45])}>
                MockSlider
            </Text>
        </View>
    );
};

describe('TransactionFilter', () => {
    const onReset = jest.fn();
    const onApply = jest.fn();
    const setSortOrderAsc = jest.fn();
    const setMinDate = jest.fn();
    const setMaxDate = jest.fn();
    const setMinPrice = jest.fn();
    const setMaxPrice = jest.fn();

    const defaultProps = {
        sortOrderAsc: false,
        setSortOrderAsc,
        minDate: null,
        maxDate: null,
        setMinDate,
        setMaxDate,
        minPrice: 10,
        maxPrice: 50,
        setMinPrice,
        setMaxPrice,
        onReset,
        onApply,
        absoluteMinPrice: 0,
        absoluteMaxPrice: 100,
    };

    it('renderiza todas las secciones y etiquetas', () => {
        const { getByLabelText } = render(
            <TransactionFilter {...defaultProps} />,
        );
        expect(getByLabelText('label-sort-order')).toBeTruthy();
        expect(getByLabelText('label-date-range')).toBeTruthy();
        expect(getByLabelText('label-price-range')).toBeTruthy();
        expect(
            getByLabelText('price-range-values').props.children.join(''),
        ).toContain('De 10.00€ a 50.00€');
    });

    it('cambia el orden al pulsar Ascendente', () => {
        const { getByLabelText } = render(
            <TransactionFilter {...defaultProps} />,
        );
        fireEvent.press(getByLabelText('sort-asc-button'));
        expect(setSortOrderAsc).toHaveBeenCalledWith(true);
    });

    it('cambia el orden al pulsar Descendente', () => {
        const { getByLabelText } = render(
            <TransactionFilter {...defaultProps} />,
        );
        fireEvent.press(getByLabelText('sort-desc-button'));
        expect(setSortOrderAsc).toHaveBeenCalledWith(false);
    });

    it('llama correctamente a onReset y onApply', () => {
        const { getByLabelText } = render(
            <TransactionFilter {...defaultProps} />,
        );
        fireEvent.press(getByLabelText('reset-button'));
        fireEvent.press(getByLabelText('apply-button'));
        expect(onReset).toHaveBeenCalled();
        expect(onApply).toHaveBeenCalled();
    });

    it('llama a setMinPrice y setMaxPrice cuando cambia el slider', () => {
        const { getByTestId } = render(<TransactionFilter {...defaultProps} />);
        fireEvent.press(getByTestId('mock-slider'));
        expect(setMinPrice).toHaveBeenCalledWith(15);
        expect(setMaxPrice).toHaveBeenCalledWith(45);
    });
});
