import { Notification } from '../models/notification.model';

export const getNextBudgetNotificationLevel = (
    spent: number,
    limit: number,
    currentLevel: number,
): number | null => {
    const percentage = (spent / limit) * 100;

    if (percentage >= 100 && currentLevel < 3) return 3;
    if (percentage >= 75 && currentLevel < 2) return 2;
    if (percentage >= 50 && currentLevel < 1) return 1;

    return null;
};

export const createBudgetNotification = async (
    userId: string,
    message: string,
) => {
    await Notification.create({
        user: userId,
        message,
        type: 'alert',
        status: 'pending',
    });
};
