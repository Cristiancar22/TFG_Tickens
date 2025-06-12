import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ManageStoreScreen from '@/app/(tabs)/index/manageStores';
import { useStores } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
    useStores: jest.fn(),
}));

jest.mock('@/components/manageStore', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return {
        StoreList: ({ onEditStore, onToggleSelect }: any) => (
            <View accessibilityLabel="store-list">
                <Text>Lista de tiendas</Text>

                <TouchableOpacity
                    accessibilityLabel="select-store-1"
                    onPress={() => onToggleSelect('1')}
                >
                    <Text>Seleccionar 1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityLabel="select-store-2"
                    onPress={() => onToggleSelect('2')}
                >
                    <Text>Seleccionar 2</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityLabel="edit-store-button"
                    onPress={() =>
                        onEditStore({
                            id: '1',
                            name: 'Tienda Uno',
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

jest.mock('@/components/modals/AddStoreModal', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return {
        AddStoreModal: ({ isVisible, onClose, onSubmit }: any) => {
            if (!isVisible) return null;

            return (
                <View accessibilityLabel="add-store-modal">
                    <Text>Modal Tienda</Text>
                    <TouchableOpacity
                        accessibilityLabel="submit-store"
                        onPress={() =>
                            onSubmit({ name: 'Nueva Tienda', groupId: null })
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

jest.mock('@/components/modals/CustomStoreSelect', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return {
        SelectMainStoreModal: ({ visible, onSelectMain, onCancel }: any) => {
            if (!visible) return null;

            return (
                <View accessibilityLabel="group-store-modal">
                    <Text>Agrupar Tiendas</Text>
                    <TouchableOpacity
                        accessibilityLabel="select-main-store"
                        onPress={() => onSelectMain('1')}
                    >
                        <Text>Seleccionar Principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityLabel="cancel-group-store"
                        onPress={onCancel}
                    >
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            );
        },
    };
});

describe('ManageStoreScreen', () => {
    const mockCreate = jest.fn();
    const mockUpdate = jest.fn();
    const mockGroup = jest.fn();

    beforeEach(() => {
        (useStores as jest.Mock).mockImplementation((selector: any) =>
            selector({
                createStore: mockCreate,
                updateStore: mockUpdate,
                groupStores: mockGroup,
            }),
        );
        jest.clearAllMocks();
    });

    it('renderiza los elementos principales', () => {
        const { getByText, getByLabelText } = render(<ManageStoreScreen />);
        expect(getByText('Tus tiendas')).toBeTruthy();
        expect(getByLabelText('store-list')).toBeTruthy();
        expect(getByLabelText('add-store-button')).toBeTruthy(); // Usa el mismo `accessibilityLabel` que los otros screens
    });

    it('abre el modal al presionar el botón flotante', () => {
        const { getByLabelText, queryByLabelText } = render(
            <ManageStoreScreen />,
        );
        expect(queryByLabelText('add-store-modal')).toBeNull();

        fireEvent.press(getByLabelText('add-store-button'));

        expect(getByLabelText('add-store-modal')).toBeTruthy();
    });

    it('edita una tienda y guarda cambios', async () => {
        const { getByLabelText } = render(<ManageStoreScreen />);

        fireEvent.press(getByLabelText('edit-store-button'));
        fireEvent.press(getByLabelText('submit-store'));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith('1', {
                name: 'Nueva Tienda',
                groupId: null,
            });
        });
    });

    it('cierra el modal de tienda', () => {
        const { getByLabelText, queryByLabelText } = render(
            <ManageStoreScreen />,
        );
        fireEvent.press(getByLabelText('add-store-button'));
        fireEvent.press(getByLabelText('close-modal'));

        expect(queryByLabelText('add-store-modal')).toBeNull();
    });

    it('agrupa tiendas seleccionadas correctamente', async () => {
        const { getByText, getByLabelText } = render(<ManageStoreScreen />);

        fireEvent.press(getByText('Agrupar tiendas'));
        fireEvent.press(getByLabelText('select-store-1'));
        fireEvent.press(getByLabelText('select-store-2'));
        fireEvent.press(getByText('Agrupar seleccionadas'));

        fireEvent.press(getByLabelText('select-main-store'));

        await waitFor(() => {
            expect(mockGroup).toHaveBeenCalledWith('1', ['1', '2']);
        });
    });
});
