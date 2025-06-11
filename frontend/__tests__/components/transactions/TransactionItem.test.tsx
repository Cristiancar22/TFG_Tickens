import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useStores } from '@/store/useStore';
import { useRouter } from 'expo-router';
import { Transaction } from '@/types';

// Mock del router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock del store
jest.mock('@/store/useStore', () => ({
    useStores: jest.fn(),
}));

describe('TransactionItem', () => {
    const mockPush = jest.fn();
    const mockGetStoreById = jest.fn();

    const transaction: Transaction = {
        _id: 'tx1',
        store: 'store1',
        purchaseDate: new Date('2024-06-01').toISOString(),
        total: 12.34,
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useStores as jest.Mock).mockReturnValue({ getStoreById: mockGetStoreById });
        jest.clearAllMocks();
    });

    it('renderiza correctamente con tienda existente', () => {
        mockGetStoreById.mockReturnValue({ id: 'store1', name: 'Tienda Prueba' });

        const { getByLabelText } = render(<TransactionItem item={transaction} />);

        expect(getByLabelText('transaction-store-name-tx1').props.children).toBe('Tienda Prueba');
        expect(getByLabelText('transaction-total-tx1').props.children.join('')).toContain('12.34 €');
        expect(getByLabelText('transaction-date-tx1')).toBeTruthy();
    });

    it('muestra "Tienda sin asignar" si la tienda no se encuentra', () => {
        mockGetStoreById.mockReturnValue(undefined);

        const { getByLabelText } = render(<TransactionItem item={transaction} />);

        expect(getByLabelText('transaction-store-name-tx1').props.children).toBe('Tienda sin asignar');
    });

    it('navega a la pantalla de detalles al pulsar el ítem', () => {
        mockGetStoreById.mockReturnValue({ id: 'store1', name: 'Tienda Prueba' });

        const { getByLabelText } = render(<TransactionItem item={transaction} />);

        fireEvent.press(getByLabelText('transaction-tx1'));
        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/transactions/[id]',
            params: { id: 'tx1' },
        });
    });
});
