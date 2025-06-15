import React from 'react';
import { render } from '@testing-library/react-native';
import { Product, TransactionDetail } from '@/types';
import { useCategories } from '@/store/useCategories';
import { TransactionDetailItem } from '@/components/transactions';

jest.mock('@/store/useCategories', () => ({
    useCategories: jest.fn(),
}));

describe('TransactionDetailItem', () => {
    const mockGetCategoryById = jest.fn();

    beforeEach(() => {
        (useCategories as jest.Mock).mockReturnValue(mockGetCategoryById);
    });

    const detail: TransactionDetail = {
        product: 'p1',
        quantity: 3,
        unitPrice: 2.5,
        subtotal: 7.5,
    };

    const product: Product = {
        id: 'p1',
        _id: 'p1',
        name: 'Manzanas',
        category: 'cat1',
    };

    it('renderiza correctamente con categoría', () => {
        mockGetCategoryById.mockReturnValue({
            primaryColor: '#FFEEAA',
            secondaryColor: '#AA5522',
            icon: 'cart-outline',
        });

        const { getByLabelText } = render(
            <TransactionDetailItem detail={detail} product={product} />,
        );

        expect(getByLabelText('product-name').props.children).toBe('Manzanas');
        expect(getByLabelText('detail-quantity').props.children).toBe(3);
        expect(
            getByLabelText('detail-unit-price').props.children.join(''),
        ).toBe('2.50 €');
        expect(getByLabelText('detail-subtotal').props.children.join('')).toBe(
            '7.50 €',
        );
        expect(getByLabelText('product-icon')).toBeTruthy();
    });

    it('renderiza correctamente sin categoría ni icono', () => {
        mockGetCategoryById.mockReturnValue(undefined);

        const { getByLabelText, queryByLabelText } = render(
            <TransactionDetailItem detail={detail} product={product} />,
        );

        expect(getByLabelText('product-name').props.children).toBe('Manzanas');
        expect(queryByLabelText('product-icon')).toBeNull();
    });

    it('muestra "Producto desconocido" si no hay producto', () => {
        const { getByLabelText } = render(
            <TransactionDetailItem detail={detail} product={undefined} />,
        );

        expect(getByLabelText('product-name').props.children).toBe(
            'Producto desconocido',
        );
    });
});
