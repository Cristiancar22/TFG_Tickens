import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ChangePasswordModal } from '@/components/modals/ChangePasswordModal';

describe('ChangePasswordModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    afterEach(() => jest.clearAllMocks());

    it('renderiza correctamente los campos', () => {
        const { getByLabelText } = render(
            <ChangePasswordModal
                isVisible
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(getByLabelText('change-password-title')).toBeTruthy();
        expect(getByLabelText('input-current-password')).toBeTruthy();
        expect(getByLabelText('input-new-password')).toBeTruthy();
        expect(getByLabelText('input-confirm-password')).toBeTruthy();
        expect(getByLabelText('submit-password-change')).toBeTruthy();
    });

    it('muestra alerta si las contraseñas no coinciden', async () => {
        const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
        const { getByLabelText } = render(
            <ChangePasswordModal
                isVisible
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        fireEvent.changeText(getByLabelText('input-new-password'), 'nueva');
        fireEvent.changeText(getByLabelText('input-confirm-password'), 'diferente');
        fireEvent.press(getByLabelText('submit-password-change'));

        await waitFor(() => {
            expect(mockOnSubmit).not.toHaveBeenCalled();
            expect(alertMock).toHaveBeenCalledWith('Las contraseñas no coinciden');
        });

        alertMock.mockRestore();
    });

    it('llama a onSubmit y onClose si las contraseñas coinciden', async () => {
        const { getByLabelText } = render(
            <ChangePasswordModal
                isVisible
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        fireEvent.changeText(getByLabelText('input-current-password'), 'actual');
        fireEvent.changeText(getByLabelText('input-new-password'), 'nueva123');
        fireEvent.changeText(getByLabelText('input-confirm-password'), 'nueva123');
        fireEvent.press(getByLabelText('submit-password-change'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                currentPassword: 'actual',
                newPassword: 'nueva123',
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('llama a onClose al pulsar fuera del modal', () => {
        const { getAllByLabelText } = render(
            <ChangePasswordModal
                isVisible
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        fireEvent(getAllByLabelText('change-password-modal')[0], 'onBackdropPress');
        expect(mockOnClose).toHaveBeenCalled();
    });
});
