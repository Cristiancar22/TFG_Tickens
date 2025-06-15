import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionList } from '@/components/transactions/TransactionList';
import { Transaction } from '@/types';

jest.mock('@/components/transactions/TransactionItem', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        TransactionItem: ({ item }: { item: import('@/types').Transaction }) => (
            <Text accessibilityLabel={`transaction-${item._id}`}>
                Mock de {item._id}
            </Text>
        ),
    };
});

describe('TransactionList', () => {
    const mockOnRefresh = jest.fn();

    const transactions: Transaction[] = [
        {
            _id: 't1',
            store: 's1',
            purchaseDate: new Date('2024-06-01').toISOString(),
            total: 5,
        },
        {
            _id: 't2',
            store: 's2',
            purchaseDate: new Date('2024-06-01').toISOString(),
            total: 10,
        },
        {
            _id: 't3',
            store: 's1',
            purchaseDate: new Date('2024-06-02').toISOString(),
            total: 8,
        },
    ];

    it('renderiza las transacciones agrupadas por fecha', () => {
        const { getByLabelText } = render(
            <TransactionList
                transactions={transactions}
                isLoading={false}
                onRefresh={mockOnRefresh}
            />,
        );

        expect(getByLabelText('section-01/06/2024')).toBeTruthy();
        expect(getByLabelText('section-02/06/2024')).toBeTruthy();

        expect(getByLabelText('transaction-t1')).toBeTruthy();
        expect(getByLabelText('transaction-t2')).toBeTruthy();
        expect(getByLabelText('transaction-t3')).toBeTruthy();
    });

    it('muestra spinner mientras carga', () => {
        const { getByLabelText } = render(
            <TransactionList
                transactions={[]}
                isLoading={true}
                onRefresh={mockOnRefresh}
            />,
        );

        expect(getByLabelText('loading-spinner')).toBeTruthy();
    });

    it('muestra mensaje si no hay transacciones y no está cargando', () => {
        const { getByLabelText, getByText } = render(
            <TransactionList
                transactions={[]}
                isLoading={false}
                onRefresh={mockOnRefresh}
            />,
        );

        expect(getByLabelText('empty-transaction-list')).toBeTruthy();
        expect(getByText('No hay transacciones disponibles')).toBeTruthy();
    });

    it('llama a onRefresh cuando se hace pull-to-refresh', () => {
        const { UNSAFE_getByType } = render(
            <TransactionList
                transactions={transactions}
                isLoading={false}
                onRefresh={mockOnRefresh}
            />,
        );

        const sectionList = UNSAFE_getByType(
            require('react-native').SectionList,
        );
        fireEvent(sectionList, 'refresh');

        expect(mockOnRefresh).toHaveBeenCalled();
    });
});
