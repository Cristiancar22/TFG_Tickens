import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { colors } from '@/constants/colors';
import { CustomCategorySelect } from '../ui/CustomCategorySelect';
import { Budget, BudgetInput } from '@/types';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: BudgetInput) => void;
    onDelete?: () => void;
    budget?: Budget | null;
};

export const AddBudgetModal = ({
    isVisible,
    onClose,
    onSubmit,
    onDelete,
    budget,
}: Props) => {
    const now = new Date();
    const defaultMonth = now.getMonth() + 1;
    const defaultYear = now.getFullYear();

    const [limitAmount, setLimitAmount] = useState('');
    const [isRecurring, setIsRecurring] = useState(true);
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (budget) {
            setLimitAmount(budget.limitAmount.toString());
            setCategory(budget.category ? budget.category._id : '');
            setIsRecurring(budget.isRecurring);
        } else {
            setLimitAmount('');
            setCategory('');
            setIsRecurring(true);
        }
    }, [budget]);

    const handleSubmit = () => {
        if (!limitAmount) return;

        onSubmit({
            limitAmount: parseFloat(limitAmount),
            month: defaultMonth,
            year: defaultYear,
            isRecurring,
            isActive: true,
            notificationsEnabled: true,
            category: category || undefined,
        });

        onClose();
        setLimitAmount('');
        setIsRecurring(true);
        setCategory('');
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar presupuesto',
            '¿Estás seguro de que quieres eliminar este presupuesto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        if (onDelete) {
                            onDelete();
                        }
                        onClose();
                    },
                },
            ],
        );
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent
            accessibilityLabel="add-budget-modal"
        >
            <View
                style={styles.overlay}
                accessibilityLabel="add-budget-overlay"
            >
                <View
                    style={styles.modal}
                    accessibilityLabel="add-budget-container"
                >
                    <Text
                        style={styles.title}
                        accessibilityLabel="add-budget-title"
                    >
                        {budget ? 'Editar presupuesto' : 'Nuevo presupuesto'}
                    </Text>

                    <TextInput
                        placeholder="Límite (€)"
                        keyboardType="numeric"
                        value={limitAmount}
                        onChangeText={setLimitAmount}
                        style={styles.input}
                        accessibilityLabel="add-budget-limit-input"
                    />

                    <CustomCategorySelect
                        selectedId={category}
                        onChange={setCategory}
                        label="Categoría"
                        accessibilityLabel="add-budget-category-select"
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        accessibilityLabel="add-budget-submit-button"
                    >
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>

                    {budget && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                            accessibilityLabel="add-budget-delete-button"
                        >
                            <Text style={styles.deleteButtonText}>
                                Eliminar
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                        accessibilityLabel="add-budget-cancel-button"
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: colors.danger,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.danger,
    },
});
