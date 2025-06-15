import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionHeader } from '@/components/transactions/TransactionHeader';
import { Store } from '@/types';

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

const stores: Store[] = [
    { id: '1', name: 'Supermercado A' },
    { id: '2', name: 'Tienda B' },
];

const getStoreById = (id: string) => stores.find((s) => s.id === id);

const propsBase = {
    storeId: '1',
    stores,
    getStoreById,
    purchaseDate: new Date('2024-05-01').toISOString(),
    onStoreChange: jest.fn(),
    onDateChange: jest.fn(),
    setShowDatePicker: jest.fn(),
    total: 123.45,
};

describe('TransactionHeader', () => {
    describe('modo edición', () => {
        it('renderiza los campos de selección y fecha', () => {
            const { getByLabelText } = render(
                <TransactionHeader {...propsBase} editMode showDatePicker={false} />
            );

            expect(getByLabelText('label-date')).toBeTruthy();
            expect(getByLabelText('date-picker-toggle')).toBeTruthy();
        });

        it('abre el selector de fecha al pulsar en el campo', () => {
            const setShowDatePicker = jest.fn();
            const { getByLabelText } = render(
                <TransactionHeader
                    {...propsBase}
                    editMode
                    setShowDatePicker={setShowDatePicker}
                    showDatePicker={false}
                />
            );

            fireEvent.press(getByLabelText('date-picker-toggle'));
            expect(setShowDatePicker).toHaveBeenCalledWith(true);
        });

        it('renderiza el selector de fecha si showDatePicker es true', () => {
            const { UNSAFE_getByType } = render(
                <TransactionHeader {...propsBase} editMode showDatePicker />
            );

            expect(UNSAFE_getByType('DateTimePicker')).toBeTruthy();
        });
    });

    describe('modo vista', () => {
        it('muestra los datos de tienda, total y fecha correctamente', () => {
            const { getByLabelText } = render(
                <TransactionHeader {...propsBase} editMode={false} />
            );

            expect(getByLabelText('label-store')).toBeTruthy();
            expect(getByLabelText('store-name').props.children).toBe('Supermercado A');

            expect(getByLabelText('label-total')).toBeTruthy();
            expect(getByLabelText('total-amount').props.children).toContain('123.45');

            expect(getByLabelText('label-date')).toBeTruthy();
            expect(getByLabelText('purchase-date').props.children).toContain('01/05/2024');
        });

        it('muestra "Tienda desconocida" si no se encuentra la tienda', () => {
            const { getByLabelText } = render(
                <TransactionHeader
                    {...propsBase}
                    storeId="no-existe"
                    editMode={false}
                />
            );

            expect(getByLabelText('store-name').props.children).toBe('Tienda desconocida');
        });
    });
});
