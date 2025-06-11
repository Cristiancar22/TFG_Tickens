import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '@/app/(auth)/register';
import { registerUser } from '@/services';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';
import { Alert } from 'react-native';

// Mocks
jest.mock('@/services', () => ({
    registerUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/store/useAuth', () => ({
    useAuth: jest.fn(),
}));

describe('Register Screen', () => {
    const mockLogin = jest.fn();
    const mockSetUser = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useAuth as jest.Mock)
            .mockReturnValueOnce(mockLogin)
            .mockReturnValueOnce(mockSetUser);
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    it('renderiza correctamente', () => {
        const { getByLabelText } = render(<Register />);

        expect(getByLabelText('input-name')).toBeTruthy();
        expect(getByLabelText('input-surname')).toBeTruthy();
        expect(getByLabelText('input-email')).toBeTruthy();
        expect(getByLabelText('input-password')).toBeTruthy();
        expect(getByLabelText('register-button')).toBeTruthy();
        expect(getByLabelText('navigate-login')).toBeTruthy();
    });

    it('muestra errores si se envía vacío', async () => {
        const { getByLabelText, findByLabelText } = render(<Register />);

        fireEvent.press(getByLabelText('register-button'));

        await expect(findByLabelText('error-nombre')).resolves.toBeTruthy();
        await expect(findByLabelText('error-apellidos')).resolves.toBeTruthy();
        await expect(findByLabelText('error-email')).resolves.toBeTruthy();
        await expect(findByLabelText('error-contraseña')).resolves.toBeTruthy();
    });

    it('envía el formulario correctamente', async () => {
        const mockResponse = {
            token: 'mocked-token',
            _id: '1',
            name: 'Juan',
            surname: 'Pérez',
            email: 'juan@example.com',
        };
        (registerUser as jest.Mock).mockResolvedValue(mockResponse);

        const { getByLabelText } = render(<Register />);

        fireEvent.changeText(getByLabelText('input-name'), 'Juan');
        fireEvent.changeText(getByLabelText('input-surname'), 'Pérez');
        fireEvent.changeText(getByLabelText('input-email'), 'juan@example.com');
        fireEvent.changeText(getByLabelText('input-password'), 'MiPassword123');

        fireEvent.press(getByLabelText('register-button'));

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith({
                name: 'Juan',
                surname: 'Pérez',
                email: 'juan@example.com',
                password: 'MiPassword123',
            });
            expect(mockSetUser).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'juan@example.com' }),
            );
            expect(mockLogin).toHaveBeenCalledWith('mocked-token');
        });
    });

    it('muestra alerta si el registro falla', async () => {
        const alertSpy = jest
            .spyOn(Alert, 'alert')
            .mockImplementation(() => {});
        (registerUser as jest.Mock).mockRejectedValue(
            new Error('Registro fallido'),
        );

        const { getByLabelText } = render(<Register />);

        fireEvent.changeText(getByLabelText('input-name'), 'Juan');
        fireEvent.changeText(getByLabelText('input-surname'), 'Pérez');
        fireEvent.changeText(getByLabelText('input-email'), 'juan@example.com');
        fireEvent.changeText(getByLabelText('input-password'), '12345678');

        fireEvent.press(getByLabelText('register-button'));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error', 'Registro fallido');
        });
    });

    it('navega a login al pulsar el enlace', () => {
        const { getByLabelText } = render(<Register />);
        fireEvent.press(getByLabelText('navigate-login'));
        expect(mockPush).toHaveBeenCalledWith('/login');
    });
});
