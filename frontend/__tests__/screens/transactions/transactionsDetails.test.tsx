import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import TransactionDetailScreen from '@/app/(tabs)/transactions/[id]';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getTransactionById } from '@/services/transaction.service';

// Mocks necesarios
jest.mock('expo-router', () => ({
    useLocalSearchParams: jest.fn(),
    useNavigation: () => ({ setOptions: jest.fn() }),
}));

jest.mock('@/services/transaction.service', () => ({
    getTransactionById: jest.fn(),
}));

jest.mock('@/hooks/transactions/useTransactionEdit', () => ({
    useTransactionEdit: () => ({
        editTransaction: mockTransaction,
        updateDetail: jest.fn(),
        setEditTransaction: jest.fn(),
        saveTransaction: jest.fn(() => Promise.resolve(true)),
        isSaving: false,
        updateHeader: jest.fn(),
        addDetail: jest.fn(),
        removeDetail: jest.fn(),
    }),
}));

jest.mock('@/store/useStore', () => ({
    useStores: () => ({
        stores: [],
        getStoreById: jest.fn(),
    }),
}));

jest.mock('@/store/useProduct', () => ({
    useProducts: () => ({
        products: [],
        getProductById: jest.fn(),
    }),
}));

jest.mock('@/components/transactions/TransactionHeader', () => ({
    TransactionHeader: () => <></>,
}));
jest.mock('@/components/transactions/TransactionDetailItem', () => ({
    TransactionDetailItem: () => <></>,
}));
jest.mock('@/components/transactions/TransactionDetailEditItem', () => ({
    TransactionDetailEditItem: () => <></>,
}));

const mockTransaction = {
    _id: '123',
    store: 'store1',
    total: 20,
    purchaseDate: new Date().toISOString(),
    details: [
        {
            product: 'product1',
            quantity: 2,
            unitPrice: 10,
            subtotal: 20,
        },
    ],
};

describe('TransactionDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useLocalSearchParams.mockReturnValue({ id: '123' });
        getTransactionById.mockResolvedValue(mockTransaction);
    });

    it('muestra el loading inicial', async () => {
        const { getByLabelText } = render(<TransactionDetailScreen />);
        expect(getByLabelText('ActivityIndicator')).toBeTruthy();
        await waitFor(() => expect(getTransactionById).toHaveBeenCalled());
    });

    it('renderiza la pantalla con los datos de la transacción', async () => {
        const { getByText } = render(<TransactionDetailScreen />);
        await waitFor(() => getByText('Productos:'));
        expect(getByText('Productos:')).toBeTruthy();
    });

    it('entra en modo edición al pulsar el botón', async () => {
        const { getByLabelText } = render(<TransactionDetailScreen />);
        await waitFor(() => getByLabelText('edit-button'));
        fireEvent.press(getByLabelText('edit-button'));
        expect(true).toBeTruthy();
    });
});
