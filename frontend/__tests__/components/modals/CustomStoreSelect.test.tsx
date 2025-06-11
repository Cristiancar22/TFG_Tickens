import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useStores } from '@/store/useStore';
import { SelectMainStoreModal } from '@/components/modals/CustomStoreSelect';

// Mock de Zustand
jest.mock('@/store/useStore');
const mockedUseStores = useStores as jest.Mock;

const mockStores = [
    { id: 's1', name: 'Mercadona' },
    { id: 's2', name: 'Lidl' },
];

describe('SelectMainStoreModal', () => {
    const mockOnSelect = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        mockedUseStores.mockImplementation((selector) =>
            selector({
                getStoreById: (id: string) =>
                    mockStores.find((s) => s.id === id),
            }),
        );
        jest.clearAllMocks();
    });

    it('renderiza las tiendas seleccionadas', () => {
        const { getByLabelText } = render(
            <SelectMainStoreModal
                visible
                selectedIds={['s1', 's2']}
                onSelectMain={mockOnSelect}
                onCancel={mockOnCancel}
            />,
        );

        expect(getByLabelText('select-main-store-title')).toBeTruthy();
        expect(getByLabelText('store-name-Mercadona')).toBeTruthy();
        expect(getByLabelText('store-name-Lidl')).toBeTruthy();
    });

    it('llama a onSelectMain al pulsar una tienda', () => {
        const { getByLabelText } = render(
            <SelectMainStoreModal
                visible
                selectedIds={['s1']}
                onSelectMain={mockOnSelect}
                onCancel={mockOnCancel}
            />,
        );

        fireEvent.press(getByLabelText('store-option-Mercadona'));
        expect(mockOnSelect).toHaveBeenCalledWith('s1');
    });

    it('llama a onCancel al pulsar el botón cancelar', () => {
        const { getByLabelText } = render(
            <SelectMainStoreModal
                visible
                selectedIds={['s1']}
                onSelectMain={mockOnSelect}
                onCancel={mockOnCancel}
            />,
        );

        fireEvent.press(getByLabelText('cancel-select-main-store'));
        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('no muestra tiendas inexistentes', () => {
        const { queryByLabelText } = render(
            <SelectMainStoreModal
                visible
                selectedIds={['non-existent']}
                onSelectMain={mockOnSelect}
                onCancel={mockOnCancel}
            />,
        );

        expect(
            queryByLabelText('store-options-list')?.props?.data?.length,
        ).toBe(0);
    });
});
