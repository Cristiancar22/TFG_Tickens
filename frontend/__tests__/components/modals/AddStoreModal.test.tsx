import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddStoreModal } from '@/components/modals/AddStoreModal';
import { Alert } from 'react-native';

describe('AddStoreModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    afterEach(() => jest.clearAllMocks());

    it('renderiza correctamente el modal vacío (modo nuevo)', () => {
        const { getByLabelText } = render(
            <AddStoreModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        expect(getByLabelText('add-store-title').props.children).toBe(
            'Añadir tienda',
        );
        expect(getByLabelText('add-store-name-input')).toBeTruthy();
        expect(getByLabelText('add-store-address-input')).toBeTruthy();
        expect(getByLabelText('add-store-submit-button')).toBeTruthy();
    });

    it('renderiza correctamente los datos si se pasa store (modo edición)', () => {
        const { getByLabelText } = render(
            <AddStoreModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                store={{ name: 'Mercadona', address: 'Calle Falsa 123' }}
            />,
        );

        expect(getByLabelText('add-store-name-input').props.value).toBe(
            'Mercadona',
        );
        expect(getByLabelText('add-store-address-input').props.value).toBe(
            'Calle Falsa 123',
        );
    });

    it('muestra una alerta si el nombre está vacío', async () => {
        const alertMock = jest
            .spyOn(Alert, 'alert')
            .mockImplementation(() => {});
        const { getByLabelText } = render(
            <AddStoreModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        fireEvent.press(getByLabelText('add-store-submit-button'));

        await waitFor(() => {
            expect(mockOnSubmit).not.toHaveBeenCalled();
            expect(alertMock).toHaveBeenCalledWith('El nombre es obligatorio');
        });

        alertMock.mockRestore();
    });

    it('llama a onSubmit y onClose con datos válidos', async () => {
        const { getByLabelText } = render(
            <AddStoreModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        fireEvent.changeText(getByLabelText('add-store-name-input'), 'Lidl');
        fireEvent.changeText(
            getByLabelText('add-store-address-input'),
            'Av. Principal 45',
        );
        fireEvent.press(getByLabelText('add-store-submit-button'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: 'Lidl',
                address: 'Av. Principal 45',
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('llama a onClose al pulsar fuera del modal', () => {
        const { getAllByLabelText } = render(
            <AddStoreModal
                isVisible={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />,
        );

        fireEvent(getAllByLabelText('add-store-modal')[0], 'onBackdropPress');
        expect(mockOnClose).toHaveBeenCalled();
    });
});
