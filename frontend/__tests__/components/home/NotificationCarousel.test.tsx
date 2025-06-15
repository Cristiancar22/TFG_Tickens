import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationCarousel } from '@/components/home/NotificationCarousel';
import { useNotifications } from '@/store/useNotifications';

jest.mock('@/store/useNotifications');
const mockedUseNotifications = useNotifications as jest.Mock;

const mockArchiveNotification = jest.fn();
const mockNotifications = [
    { _id: '1', message: 'Notificación 1' },
    { _id: '2', message: 'Notificación 2' },
];

const withNotifications = (notifications: any[]) =>
    mockedUseNotifications.mockImplementation((selector?: any) => {
        const fakeState = {
            notifications,
            archiveNotification: mockArchiveNotification,
        };
        return selector ? selector(fakeState) : fakeState;
    });

const triggerLayout = (container: any, width = 300) => {
    fireEvent(container, 'layout', {
        nativeEvent: { layout: { width, height: 0, x: 0, y: 0 } },
    });
};

describe('NotificationCarousel', () => {
    afterEach(() => jest.clearAllMocks());

    it('no renderiza nada si no hay notificaciones', () => {
        withNotifications([]);

        const { queryByLabelText } = render(<NotificationCarousel />);
        expect(queryByLabelText('notification-carousel-container')).toBeNull();
    });

    it('renderiza correctamente las notificaciones', () => {
        withNotifications(mockNotifications);

        const { getByLabelText } = render(<NotificationCarousel />);

        triggerLayout(getByLabelText('notification-carousel-container'));

        expect(getByLabelText('notification-item-1')).toBeTruthy();
        expect(getByLabelText('notification-message-1').props.children).toBe(
            'Notificación 1',
        );
    });

    it('archiva una notificación al pulsar el botón', () => {
        withNotifications(mockNotifications);

        const { getByLabelText } = render(<NotificationCarousel />);
        triggerLayout(getByLabelText('notification-carousel-container'));

        fireEvent.press(getByLabelText('archive-button-1'));
        expect(mockArchiveNotification).toHaveBeenCalledWith('1');
    });
});
