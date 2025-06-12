import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '@/app/(auth)/login';
import { loginUser } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';
import { Alert } from 'react-native';

// 🔧 Mocks necesarios
jest.mock('@/services/auth.service', () => ({
    loginUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/store/useAuth', () => ({
    useAuth: jest.fn(),
}));

// 🧪 Tests
describe('Login Screen', () => {
    const mockLogin = jest.fn();
    const mockSetUser = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        (useAuth as jest.Mock).mockImplementation((fn) =>
            fn({ login: mockLogin, setUser: mockSetUser }),
        );
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        jest.clearAllMocks();
    });

    it('renderiza todos los elementos correctamente', () => {
        const { getByLabelText } = render(<Login />);
        expect(getByLabelText('input-email')).toBeTruthy();
        expect(getByLabelText('input-password')).toBeTruthy();
        expect(getByLabelText('login-button')).toBeTruthy();
        expect(getByLabelText('navigate-register')).toBeTruthy();
    });

    it('realiza login exitoso y guarda el usuario y token', async () => {
        (loginUser as jest.Mock).mockResolvedValue({
            token: 'mock-token',
            name: 'Juan',
            email: 'juan@example.com',
        });

        const { getByLabelText } = render(<Login />);

        fireEvent.changeText(getByLabelText('input-email'), 'juan@example.com');
        fireEvent.changeText(getByLabelText('input-password'), 'MiPassword123');
        fireEvent.press(getByLabelText('login-button'));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                email: 'juan@example.com',
                password: 'MiPassword123',
            });
            expect(mockSetUser).toHaveBeenCalledWith({
                name: 'Juan',
                email: 'juan@example.com',
            });
            expect(mockLogin).toHaveBeenCalledWith('mock-token');
        });
    });

    it('muestra alerta si el login falla', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
        (loginUser as jest.Mock).mockRejectedValue(new Error('Credenciales incorrectas'));

        const { getByLabelText } = render(<Login />);

        fireEvent.changeText(getByLabelText('input-email'), 'fail@example.com');
        fireEvent.changeText(getByLabelText('input-password'), 'wrongpass');
        fireEvent.press(getByLabelText('login-button'));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalled();
        });

        alertSpy.mockRestore();
    });

    it('navega a la pantalla de registro', () => {
        const { getByLabelText } = render(<Login />);
        fireEvent.press(getByLabelText('navigate-register'));
        expect(mockPush).toHaveBeenCalledWith('/register');
    });
});
