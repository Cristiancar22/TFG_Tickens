import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ProductItem } from '@/components/manageProducts/ProductItem';
import { Product } from '@/types';

jest.mock('@/hooks/manageProduct/useProductManager', () => ({
    useProductManager: () => ({
        handleDelete: mockHandleDelete,
    }),
}));

const mockHandleDelete = jest.fn();
const mockEdit = jest.fn();
const mockToggleSelect = jest.fn();
const mockAlert = jest.spyOn(Alert, 'alert');

const fakeProduct: Product = {
    id: 'prod1',
    name: 'Producto 1',
};

describe('ProductItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza correctamente con los datos del producto', () => {
        const { getByLabelText } = render(
            <ProductItem product={fakeProduct} onEdit={mockEdit} />,
        );

        expect(getByLabelText('product-item-prod1')).toBeTruthy();
        expect(getByLabelText('product-name-prod1').props.children).toBe(
            'Producto 1',
        );
        expect(getByLabelText('edit-button-prod1')).toBeTruthy();
        expect(getByLabelText('delete-button-prod1')).toBeTruthy();
    });

    it('llama a onEdit al pulsar el botón de editar', () => {
        const { getByLabelText } = render(
            <ProductItem product={fakeProduct} onEdit={mockEdit} />,
        );

        fireEvent.press(getByLabelText('edit-button-prod1'));
        expect(mockEdit).toHaveBeenCalledWith(fakeProduct);
    });

    it('llama a onToggleSelect en modo agrupación', () => {
        const { getByLabelText } = render(
            <ProductItem
                product={fakeProduct}
                onEdit={mockEdit}
                isGroupingMode
                onToggleSelect={mockToggleSelect}
            />,
        );

        fireEvent.press(getByLabelText('product-item-prod1'));
        expect(mockToggleSelect).toHaveBeenCalledWith('prod1');
    });

    it('lanza alerta de confirmación al borrar', () => {
        const { getByLabelText } = render(
            <ProductItem product={fakeProduct} onEdit={mockEdit} />,
        );

        fireEvent.press(getByLabelText('delete-button-prod1'));

        expect(mockAlert).toHaveBeenCalledWith(
            'Confirmar eliminación',
            expect.stringContaining('Producto 1'),
            expect.any(Array),
        );

        const buttons = mockAlert.mock.calls[0][2];
        const deleteBtn = buttons?.find((b) => b.text === 'Eliminar');
        deleteBtn?.onPress?.();

        expect(mockHandleDelete).toHaveBeenCalledWith('prod1');
    });
});
