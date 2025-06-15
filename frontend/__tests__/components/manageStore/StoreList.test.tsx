import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StoreList } from '@/components/manageStore/StoreList';
import { useStores } from '@/store/useStore';

jest.mock('@/store/useStore');
const mockedUseStores = useStores as jest.Mock;

jest.mock('@/hooks/manageStore/useStoreManager', () => ({
    useStoreManager: () => ({ handleDelete: jest.fn() }),
}));

const mockStores = [
    { id: '1', name: 'Mercadona' },
    { id: '2', name: 'Lidl' },
    { id: '3', name: 'Carrefour' },
];

const withStores = (stores: any[]) =>
    mockedUseStores.mockImplementation((selector: any) => selector({ stores }));

describe('StoreList', () => {
    afterEach(() => jest.clearAllMocks());

    it('renderiza correctamente los elementos principales', () => {
        withStores(mockStores);

        const { getByLabelText } = render(<StoreList onEditStore={() => {}} />);

        expect(getByLabelText('store-list-container')).toBeTruthy();
        expect(getByLabelText('store-search-input')).toBeTruthy();
        expect(getByLabelText('store-flatlist')).toBeTruthy();
        expect(getByLabelText('store-item-1')).toBeTruthy();
        expect(getByLabelText('store-item-2')).toBeTruthy();
        expect(getByLabelText('store-item-3')).toBeTruthy();
    });

    it('filtra resultados según el input de búsqueda', () => {
        withStores(mockStores);

        const { getByLabelText, queryByLabelText } = render(
            <StoreList onEditStore={() => {}} />,
        );

        fireEvent.changeText(getByLabelText('store-search-input'), 'lid');

        expect(queryByLabelText('store-item-1')).toBeNull();
        expect(queryByLabelText('store-item-2')).toBeTruthy();
        expect(queryByLabelText('store-item-3')).toBeNull();
    });

    it('invoca onEditStore al pulsar el botón de edición', () => {
        withStores(mockStores);

        const mockEdit = jest.fn();
        const { getByLabelText } = render(<StoreList onEditStore={mockEdit} />);

        fireEvent.press(getByLabelText('edit-store-1'));
        expect(mockEdit).toHaveBeenCalledWith(mockStores[0]);
    });

    it('llama a onToggleSelect en modo agrupación', () => {
        withStores(mockStores);

        const toggle = jest.fn();
        const { getByLabelText } = render(
            <StoreList
                onEditStore={() => {}}
                isGroupingMode
                onToggleSelect={toggle}
            />,
        );

        fireEvent.press(getByLabelText('store-item-2'));
        expect(toggle).toHaveBeenCalledWith('2');
    });
});
