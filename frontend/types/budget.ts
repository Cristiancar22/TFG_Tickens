import { Category } from './category';

export type Budget = {
    id: string;
    _id?: string;
    user: string;
    category?: Category;
    limitAmount: number;
    spentAmount: number;
    month: number;
    year: number;
    notificationsEnabled: boolean;
    isActive: boolean;
    isRecurring: boolean;
};

export type BudgetInput = {
    category?: string;
    limitAmount: number;
    month: number;
    year: number;
    isRecurring: boolean;
    notificationsEnabled: boolean;
    isActive: boolean;
};