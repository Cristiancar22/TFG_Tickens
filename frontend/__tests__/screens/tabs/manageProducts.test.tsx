import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useProducts } from '@/store/useProduct';
import ManageProductScreen from '@/app/(tabs)/index/manageProducts';

// 🧪 Mocks necesarios
jest.mock('@/store/useProduct', () => ({
    useProducts: jest.fn(),
}));

jest.mock('@/components/manageProducts', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return {
        ProductList: ({ onToggleSelect, onEditProduct }: any) => (
            <View accessibilityLabel="product-list">
                <Text>Lista de productos</Text>

                <TouchableOpacity
                    accessibilityLabel="select-product-1"
                    onPress={() => onToggleSelect('1')}
                >
                    <Text>Seleccionar 1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityLabel="select-product-2"
                    onPress={() => onToggleSelect('2')}
                >
                    <Text>Seleccionar 2</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityLabel="edit-product-button"
                    onPress={() =>
                        onEditProduct({
                            id: '1',
                            name: 'Camiseta',
                            price: 10,
                            groupId: null,
                        })
                    }
                >
                    <Text>Editar</Text>
                </TouchableOpacity>
            </View>
        ),
    };
});

jest.mock('@/components/modals/AddProductModal', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        AddProductModal: ({ isVisible, onClose, onSubmit }: any) => {
            if (!isVisible) return null;
            return (
                <View accessibilityLabel="add-product-modal">
                    <Text>Modal Producto</Text>
                    <TouchableOpacity
                        accessibilityLabel="submit-product"
                        onPress={() =>
                            onSubmit({
                                name: 'Nuevo producto',
                                price: 15,
                                groupId: null,
                            })
                        }
                    >
                        <Text>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityLabel="close-modal"
                        onPress={onClose}
                    >
                        <Text>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            );
        },
    };
});

jest.mock('@/components/modals/CustomProductSelect', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        SelectMainProductModal: ({ visible, onCancel, onSelectMain }: any) => {
            if (!visible) return null;
            return (
                <View accessibilityLabel="group-modal">
                    <Text>Agrupar Productos</Text>
                    <TouchableOpacity
                        accessibilityLabel="select-main"
                        onPress={() => onSelectMain('1')}
                    >
                        <Text>Seleccionar Principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityLabel="cancel-group"
                        onPress={onCancel}
                    >
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            );
        },
    };
});

describe('ManageProductScreen', () => {
    const mockCreate = jest.fn();
    const mockUpdate = jest.fn();
    const mockGroup = jest.fn();

    beforeEach(() => {
        (useProducts as jest.Mock).mockImplementation((selector: any) =>
            selector({
                createProduct: mockCreate,
                updateProduct: mockUpdate,
                groupProducts: mockGroup,
            }),
        );
        jest.clearAllMocks();
    });

    it('renderiza los elementos principales', () => {
        const { getByText, getByLabelText } = render(<ManageProductScreen />);
        expect(getByText('Tus productos')).toBeTruthy();
        expect(getByLabelText('product-list')).toBeTruthy();
        expect(getByLabelText('add-product-button')).toBeTruthy();
    });

    it('abre el modal al presionar el botón flotante', () => {
        const { getByLabelText, queryByLabelText } = render(
            <ManageProductScreen />,
        );
        expect(queryByLabelText('add-product-modal')).toBeNull();

        fireEvent.press(getByLabelText('add-product-button'));

        expect(getByLabelText('add-product-modal')).toBeTruthy();
    });

    it('edita un producto al hacer clic en editar', async () => {
        const { getByLabelText } = render(<ManageProductScreen />);
        fireEvent.press(getByLabelText('edit-product-button'));

        fireEvent.press(getByLabelText('submit-product'));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith('1', {
                name: 'Nuevo producto',
                price: 15,
                groupId: null,
            });
        });
    });

    it('cierra el modal al pulsar cerrar', () => {
        const { getByLabelText, queryByLabelText } = render(
            <ManageProductScreen />,
        );
        fireEvent.press(getByLabelText('add-product-button'));
        fireEvent.press(getByLabelText('close-modal'));

        expect(queryByLabelText('add-product-modal')).toBeNull();
    });

    it('agrupa productos seleccionados correctamente', async () => {
        const { getByText, getByLabelText } = render(<ManageProductScreen />);

        fireEvent.press(getByText('Agrupar productos'));

        fireEvent.press(getByLabelText('select-product-1'));
        fireEvent.press(getByLabelText('select-product-2'));

        fireEvent.press(getByText('Agrupar seleccionados'));
        fireEvent.press(getByLabelText('select-main'));

        await waitFor(() => {
            expect(mockGroup).toHaveBeenCalledWith('1', ['1', '2']);
        });
    });
});
