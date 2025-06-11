import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { Product } from '@/types';
import { Alert } from 'react-native';

describe('AddProductModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza correctamente en modo creación', () => {
        const { getByLabelText, queryByLabelText } = render(
            <AddProductModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(getByLabelText('add-product-title').props.children).toBe('Añadir producto');
        expect(getByLabelText('add-product-name-input')).toBeTruthy();
        expect(getByLabelText('add-product-description-input')).toBeTruthy();
        expect(getByLabelText('add-product-category-select')).toBeTruthy();
        expect(getByLabelText('add-product-submit-button')).toBeTruthy();
        expect(queryByLabelText('edit-product-title')).toBeNull();
    });

    it('renderiza correctamente en modo edición', () => {
        const mockProduct: Product = {
            id: 'prod123',
            name: 'Botella de agua',
            description: '1L',
            category: 'bebidas',
        };

        const { getByLabelText } = render(
            <AddProductModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                product={mockProduct}
            />
        );

        expect(getByLabelText('add-product-title').props.children).toBe('Editar producto');
        expect(getByLabelText('add-product-name-input').props.value).toBe('Botella de agua');
        expect(getByLabelText('add-product-description-input').props.value).toBe('1L');
    });

    it('llama a onSubmit y onClose al guardar con nombre válido', async () => {
        const { getByLabelText } = render(
            <AddProductModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        fireEvent.changeText(getByLabelText('add-product-name-input'), 'Café');
        fireEvent.press(getByLabelText('add-product-submit-button'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: 'Café',
                description: '',
                category: '',
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('no llama a onSubmit si el nombre está vacío', async () => {
        const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

        const { getByLabelText } = render(
            <AddProductModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        fireEvent.changeText(getByLabelText('add-product-name-input'), '');
        fireEvent.press(getByLabelText('add-product-submit-button'));

        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalledWith('El nombre es obligatorio');

        alertMock.mockRestore();
    });
});
