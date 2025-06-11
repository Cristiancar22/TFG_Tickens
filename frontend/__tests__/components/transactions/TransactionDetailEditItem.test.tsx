import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionDetailEditItem } from '@/components/transactions/TransactionDetailEditItem';
import { createMockProduct } from '@/__tests__/helpers';

describe('TransactionDetailEditItem', () => {
    // 2 productos simulados
    const products = [
        createMockProduct({ id: '1', name: 'Producto 1', category: 'cat1' }),
        createMockProduct({ id: '2', name: 'Producto 2', category: 'cat2' }),
    ];

    const getProductById = (id: string) => products.find((p) => p.id === id);
    const mockOnUpdate = jest.fn();
    const mockOnRemove = jest.fn();

    afterEach(() => jest.clearAllMocks());

    it('renderiza valores iniciales', () => {
        const { getByLabelText } = render(
            <TransactionDetailEditItem
                productId="1"
                quantity={2}
                unitPrice={10}
                onUpdate={mockOnUpdate}
                onRemove={mockOnRemove}
                products={products}
                getProductById={getProductById}
            />,
        );

        expect(getByLabelText('quantity-input').props.value).toBe('2');
        expect(getByLabelText('unit-price-input').props.value).toBe('10');
    });

    it('llama a onUpdate al cambiar cantidad', () => {
        const { getByLabelText } = render(
            <TransactionDetailEditItem
                productId="1"
                quantity={2}
                unitPrice={10}
                onUpdate={mockOnUpdate}
                onRemove={mockOnRemove}
                products={products}
                getProductById={getProductById}
            />,
        );

        const qtyInput = getByLabelText('quantity-input');
        fireEvent.changeText(qtyInput, '5');
        fireEvent(qtyInput, 'onEndEditing');

        expect(mockOnUpdate).toHaveBeenCalledWith({ quantity: 5 });
    });

    it('llama a onUpdate al cambiar precio unitario', () => {
        const { getByLabelText } = render(
            <TransactionDetailEditItem
                productId="1"
                quantity={2}
                unitPrice={10}
                onUpdate={mockOnUpdate}
                onRemove={mockOnRemove}
                products={products}
                getProductById={getProductById}
            />,
        );

        const priceInput = getByLabelText('unit-price-input');
        fireEvent.changeText(priceInput, '12.5');
        fireEvent(priceInput, 'onEndEditing');

        expect(mockOnUpdate).toHaveBeenCalledWith({ unitPrice: 12.5 });
    });

    it('llama a onRemove al pulsar eliminar', () => {
        const { getByLabelText } = render(
            <TransactionDetailEditItem
                productId="1"
                quantity={2}
                unitPrice={10}
                onUpdate={mockOnUpdate}
                onRemove={mockOnRemove}
                products={products}
                getProductById={getProductById}
            />,
        );

        fireEvent.press(getByLabelText('remove-transaction-detail-button'));
        expect(mockOnRemove).toHaveBeenCalled();
    });
});
