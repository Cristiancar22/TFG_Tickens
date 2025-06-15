export type SavingsGoal = {
    id: string;
    title: string;
    targetAmount: number;
    accumulatedAmount: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
};
