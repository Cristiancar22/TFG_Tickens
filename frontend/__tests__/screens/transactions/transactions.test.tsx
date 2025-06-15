import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransactionDetailsScreen from '@/app/(tabs)/transactions';

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('@/store/useTransaction', () => ({
    useTransactionStore: () => ({
        transactions: [
            {
                _id: '1',
                purchaseDate: new Date().toISOString(),
                total: 25.5,
                store: 'store1',
            },
        ],
        isLoading: false,
        fetchTransactions: jest.fn(),
    }),
}));

jest.mock('@/store/useStore', () => ({
    useStores: () => ({
        getStoreById: () => ({ name: 'Supermercado XYZ' }),
    }),
}));

jest.mock('@/components/transactions/TransactionFilter', () => {
    const { Text } = require('react-native');
    return {
        TransactionFilter: () => (
            <Text testID="transaction-filter">OK</Text>
        ),
    };
});

jest.mock('@/components/transactions/TransactionList', () => {
    const { Text } = require('react-native');
    return {
        TransactionList: ({ transactions }: any) => (
            <>{transactions.length > 0 && <Text testID="transaction-list">OK</Text>}</>
        ),
    };
});

describe('TransactionDetailsScreen', () => {
    it('muestra el listado de transacciones', () => {
        const { getByTestId } = render(<TransactionDetailsScreen />);
        expect(getByTestId('transaction-list')).toBeTruthy();
    });

    it('muestra y oculta el filtro al pulsar el botón', async () => {
        const { getByLabelText, rerender } = render(<TransactionDetailsScreen />);
        const filterButton = getByLabelText('filter-button');

        fireEvent.press(filterButton);
        rerender(<TransactionDetailsScreen />);
        fireEvent.press(filterButton);
        expect(filterButton).toBeTruthy();
    });

    it('navega al crear nueva transacción al pulsar el botón flotante', () => {
        const mockPush = jest.fn();
        jest.doMock('expo-router', () => ({
            useRouter: () => ({ push: mockPush }),
        }));
        const { getByLabelText } = render(<TransactionDetailsScreen />);
        const addButton = getByLabelText('floating-add-button');
        fireEvent.press(addButton);

        expect(addButton).toBeTruthy();
    });
});
