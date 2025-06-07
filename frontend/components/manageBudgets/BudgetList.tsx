import { useBudgets } from '@/store/useBudgets';
import { Budget } from '@/types';
import { FlatList } from 'react-native';
import { BudgetItem } from './BudgetItem';

type Props = {
    onEditBudget: (budget: Budget) => void;
};

export const BudgetList = ({ onEditBudget }: Props) => {
    const budgets = useBudgets((s) => s.budgets);

    const renderItem = ({ item }: { item: Budget }) => (
        <BudgetItem budget={item} onEdit={onEditBudget} />
    );

    return (
        <FlatList
            data={budgets}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 16 }}
        />
    );
};
