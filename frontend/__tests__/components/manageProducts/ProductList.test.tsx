import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductList } from '@/components/manageProducts/ProductList';
import { useProducts } from '@/store/useProduct';

jest.mock('@/store/useProduct');
const mockedUseProducts = useProducts as jest.Mock;

jest.mock('@/hooks/manageProduct/useProductManager', () => ({
    useProductManager: () => ({ handleDelete: jest.fn() }),
}));

const mockProducts = [
    { id: 'p1', name: 'Manzanas', store: 's1', user: 'u1' },
    { id: 'p2', name: 'Pan', store: 's1', user: 'u1' },
    { id: 'p3', name: 'Leche', store: 's1', user: 'u1' },
];

const withProducts = (products: any[]) =>
    mockedUseProducts.mockImplementation((selector: any) =>
        selector({ products }),
    );

describe('ProductList', () => {
    afterEach(() => jest.clearAllMocks());

    it('renderiza correctamente todos los productos', () => {
        withProducts(mockProducts);

        const { getByLabelText } = render(
            <ProductList onEditProduct={jest.fn()} />,
        );

        expect(getByLabelText('product-item-p1')).toBeTruthy();
        expect(getByLabelText('product-item-p2')).toBeTruthy();
        expect(getByLabelText('product-item-p3')).toBeTruthy();
    });

    it('filtra productos correctamente desde el input', () => {
        withProducts(mockProducts);

        const { getByLabelText, queryByLabelText } = render(
            <ProductList onEditProduct={jest.fn()} />,
        );

        fireEvent.changeText(getByLabelText('product-search-input'), 'pan');

        expect(queryByLabelText('product-item-p1')).toBeNull();
        expect(queryByLabelText('product-item-p2')).toBeTruthy();
        expect(queryByLabelText('product-item-p3')).toBeNull();
    });

    it('invoca onEditProduct al pulsar el botón de edición', () => {
        withProducts(mockProducts);
        const mockEdit = jest.fn();

        const { getByLabelText } = render(
            <ProductList onEditProduct={mockEdit} />,
        );

        fireEvent.press(getByLabelText('edit-button-p1'));
        expect(mockEdit).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('llama a onToggleSelect en modo agrupación', () => {
        withProducts(mockProducts);
        const toggle = jest.fn();

        const { getByLabelText } = render(
            <ProductList
                onEditProduct={jest.fn()}
                isGroupingMode
                onToggleSelect={toggle}
            />,
        );

        fireEvent.press(getByLabelText('product-item-p2'));
        expect(toggle).toHaveBeenCalledWith('p2');
    });
});
