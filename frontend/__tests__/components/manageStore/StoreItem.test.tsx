import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Store } from '@/types';
import { StoreItem } from '@/components/manageStore';

jest.mock('@/hooks/manageStore/useStoreManager', () => ({
    useStoreManager: () => ({
        handleDelete: jest.fn(),
    }),
}));

const mockStore: Store = {
    id: 'store1',
    name: 'Mercadona',
};

describe('StoreItem', () => {
    it('renderiza correctamente el nombre de la tienda', () => {
        const { getByLabelText } = render(
            <StoreItem store={mockStore} onEdit={() => {}} />
        );

        expect(getByLabelText('store-item-store1')).toBeTruthy();
        expect(getByLabelText('store-name-store1').props.children).toBe('Mercadona');
    });

    it('llama a onEdit cuando se pulsa el botón de editar', () => {
        const mockEdit = jest.fn();

        const { getByLabelText } = render(
            <StoreItem store={mockStore} onEdit={mockEdit} />
        );

        fireEvent.press(getByLabelText('edit-store-store1'));
        expect(mockEdit).toHaveBeenCalledWith(mockStore);
    });

    it('no lanza error al pulsar eliminar (mock)', () => {
        const { getByLabelText } = render(
            <StoreItem store={mockStore} onEdit={() => {}} />
        );

        expect(() => {
            fireEvent.press(getByLabelText('delete-store-store1'));
        }).not.toThrow();
    });

    it('llama a onToggleSelect en modo agrupación', () => {
        const mockToggle = jest.fn();

        const { getByLabelText } = render(
            <StoreItem
                store={mockStore}
                onEdit={() => {}}
                isGroupingMode
                onToggleSelect={mockToggle}
            />
        );

        fireEvent.press(getByLabelText('store-item-store1'));
        expect(mockToggle).toHaveBeenCalledWith('store1');
    });

    it('no llama a onToggleSelect si no está en modo agrupación', () => {
        const mockToggle = jest.fn();

        const { getByLabelText } = render(
            <StoreItem
                store={mockStore}
                onEdit={() => {}}
                onToggleSelect={mockToggle}
            />
        );

        fireEvent.press(getByLabelText('store-item-store1'));
        expect(mockToggle).not.toHaveBeenCalled();
    });
});
