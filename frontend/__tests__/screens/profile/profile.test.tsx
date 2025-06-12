import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfileScreen } from '@/app/(tabs)/profile/index';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'expo-router';
import { useUpdateAvatar } from '@/hooks/profile/useUpdateAvatar';
import { useUpdatePassword } from '@/hooks/profile/useUpdatePassword';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/store/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/hooks/profile/useUpdateAvatar', () => ({
    useUpdateAvatar: jest.fn(),
}));

jest.mock('@/hooks/profile/useUpdatePassword', () => ({
    useUpdatePassword: jest.fn(),
}));

describe('ProfileScreen', () => {
    const mockPush = jest.fn();
    const mockLogout = jest.fn();
    const mockUpdateAvatar = jest.fn();
    const mockUpdatePassword = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        (useAuth as jest.Mock).mockImplementation((selector) =>
            selector({
                logout: mockLogout,
                user: {
                    name: 'Carlos',
                    surname: 'Pérez',
                    email: 'carlos@example.com',
                    avatarUrl: '/avatars/carlos.png',
                },
            }),
        );

        (useUpdateAvatar as jest.Mock).mockReturnValue({
            updateAvatar: mockUpdateAvatar,
        });

        (useUpdatePassword as jest.Mock).mockReturnValue({
            update: mockUpdatePassword,
            loading: false,
        });
    });

    it('renderiza los datos del usuario', () => {
        const { getByLabelText } = render(<ProfileScreen />);

        expect(getByLabelText('profile-name').props.children).toBe(
            'Carlos Pérez',
        );
        expect(getByLabelText('profile-email').props.children).toBe(
            'carlos@example.com',
        );
        expect(getByLabelText('profile-avatar-image')).toBeTruthy();
    });

    it('navega a la pantalla de edición al pulsar "Modificar perfil"', () => {
        const { getByLabelText } = render(<ProfileScreen />);
        const editButton = getByLabelText('edit-profile-button');

        fireEvent.press(editButton);
        expect(mockPush).toHaveBeenCalledWith('/(tabs)/profile/edit');
    });

    it('abre el modal de cambiar contraseña', () => {
        const { getByLabelText } = render(<ProfileScreen />);
        const passwordButton = getByLabelText('change-password-button');

        fireEvent.press(passwordButton);

        expect(getByLabelText('change-password-title')).toBeTruthy();

    });

    it('ejecuta logout al pulsar "Cerrar sesión"', () => {
        const { getByLabelText } = render(<ProfileScreen />);
        const logoutButton = getByLabelText('logout-button');

        fireEvent.press(logoutButton);
        expect(mockLogout).toHaveBeenCalled();
    });
});
