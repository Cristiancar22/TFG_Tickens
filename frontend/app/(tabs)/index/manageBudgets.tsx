import { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBudgets } from '@/store/useBudgets';
import { BudgetList } from '@/components/manageBudgets/BudgetList';
import { AddBudgetModal } from '@/components/modals/AddBudgetModal';
import { colors } from '@/constants/colors';
import { Budget, BudgetInput } from '@/types';

export const ManageBudgetsScreen = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

    const createBudget = useBudgets((s) => s.createBudget);
    const updateBudget = useBudgets((s) => s.updateBudget);
    const fetchBudgets = useBudgets((s) => s.fetchBudgets);
    const deleteBudget = useBudgets((s) => s.deleteBudget);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    useEffect(() => {
        fetchBudgets(month, year);
    }, [month, year]);

    const handleOpenCreate = () => {
        setSelectedBudget(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (budget: Budget) => {
        setSelectedBudget(budget);
        setModalVisible(true);
    };

    const handleSubmit = async (data: BudgetInput) => {
        if (selectedBudget) {
            await updateBudget(selectedBudget.id, data);
        } else {
            await createBudget(data);
        }
    };

    const handleDelete = async () => {
        if (selectedBudget) {
            await deleteBudget(selectedBudget.id);
            setModalVisible(false);
            setSelectedBudget(null);
        }
    };

    return (
        <View
            className="flex-1 bg-white"
            accessibilityLabel="manage-budgets-screen"
        >
            <BudgetList
                onEditBudget={handleOpenEdit}
            />

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleOpenCreate}
                accessibilityLabel="add-budget-button"
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            <AddBudgetModal
                budget={selectedBudget}
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 8,
        elevation: 5,
    },
});

export default ManageBudgetsScreen;
