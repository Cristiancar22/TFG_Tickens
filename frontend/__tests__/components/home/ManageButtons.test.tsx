import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ManageButtons } from '@/components/home/ManageButtons';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('ManageButtons', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    });

    it('renderiza todos los botones de gestión con sus labels correctos', () => {
        const { getByLabelText } = render(<ManageButtons />);

        expect(getByLabelText('manage-products-button')).toBeTruthy();
        expect(getByLabelText('manage-stores-button')).toBeTruthy();
        expect(getByLabelText('manage-budgets-button')).toBeTruthy();
        expect(getByLabelText('manage-savings-button')).toBeTruthy();
    });

    it('navega correctamente al pulsar un botón', () => {
        const { getByLabelText } = render(<ManageButtons />);

        fireEvent.press(getByLabelText('manage-products-button'));
        expect(pushMock).toHaveBeenCalledWith('/(tabs)/manageProducts');

        fireEvent.press(getByLabelText('manage-savings-button'));
        expect(pushMock).toHaveBeenCalledWith('/(tabs)/savings');
    });
});
