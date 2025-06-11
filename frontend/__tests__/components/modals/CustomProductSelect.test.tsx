import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useProducts } from '@/store/useProduct';
import { SelectMainProductModal } from '@/components/modals/CustomProductSelect';

// Mocks
jest.mock('@/store/useProduct', () => ({
    useProducts: jest.fn(),
}));

const mockProducts = [
    { id: '1', name: 'Producto A' },
    { id: '2', name: 'Producto B' },
];

describe('SelectMainProductModal', () => {
    const mockOnSelectMain = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useProducts as jest.Mock).mockImplementation((selector) =>
            selector({
                getProductById: (id: string) =>
                    mockProducts.find((p) => p.id === id),
            })
        );
    });

    it('renderiza correctamente los productos seleccionados', () => {
        const { getByLabelText } = render(
            <SelectMainProductModal
                visible={true}
                selectedIds={['1', '2']}
                onSelectMain={mockOnSelectMain}
                onCancel={mockOnCancel}
            />
        );

        expect(getByLabelText('select-main-product-title').props.children).toBe(
            'Selecciona el producto principal'
        );
        expect(getByLabelText('product-name-Producto A')).toBeTruthy();
        expect(getByLabelText('product-name-Producto B')).toBeTruthy();
    });

    it('llama a onSelectMain cuando se selecciona un producto', () => {
        const { getByLabelText } = render(
            <SelectMainProductModal
                visible={true}
                selectedIds={['1']}
                onSelectMain={mockOnSelectMain}
                onCancel={mockOnCancel}
            />
        );

        fireEvent.press(getByLabelText('product-option-Producto A'));
        expect(mockOnSelectMain).toHaveBeenCalledWith('1');
    });

    it('llama a onCancel al pulsar el botón de cancelar', () => {
        const { getByLabelText } = render(
            <SelectMainProductModal
                visible={true}
                selectedIds={['1']}
                onSelectMain={mockOnSelectMain}
                onCancel={mockOnCancel}
            />
        );

        fireEvent.press(getByLabelText('cancel-select-main-product'));
        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('no muestra productos inexistentes', () => {
        const { queryByLabelText } = render(
            <SelectMainProductModal
                visible={true}
                selectedIds={['non-existent']}
                onSelectMain={mockOnSelectMain}
                onCancel={mockOnCancel}
            />
        );

        expect(queryByLabelText('product-options-list')?.props?.data?.length).toBe(0);
    });
});
