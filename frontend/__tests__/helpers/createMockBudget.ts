import { Budget } from '@/types';

export const createMockBudget = (overrides: Partial<Budget>): Budget => ({
    _id: 'mock-id',
    category: undefined,
    id: 'mock-id',
    isActive: true,
    isRecurring: true,
    limitAmount: 100,
    month: 1,
    notificationsEnabled: true,
    spentAmount: 0,
    user: 'mock-user-id',
    year: 2025,
    ...overrides,
});
