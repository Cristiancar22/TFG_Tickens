import { useState } from 'react';
import { Transaction, TransactionDetail } from '@/types';
import { updateTransaction } from '@/services/transaction.service';
import { Alert } from 'react-native';

export const useTransactionEdit = (initialTransaction: Transaction) => {
    const [editTransaction, setEditTransaction] =
        useState<Transaction>(initialTransaction);
    const [isSaving, setIsSaving] = useState(false);

    const updateDetail = (
        index: number,
        detail: Partial<TransactionDetail>,
    ) => {
        setEditTransaction((prev) => {
            const updatedDetalles = prev.details?.map((d, i) =>
                i === index ? { ...d, ...detail } : d,
            );
            return { ...prev, detalles: updatedDetalles };
        });
    };

    const saveTransaction = async () => {
        setIsSaving(true);
        try {
            await updateTransaction(editTransaction._id, editTransaction);
            Alert.alert('Éxito', 'Transacción actualizada correctamente.');
            return true;
        } catch (error) {
            console.error('Error actualizando:', error);
            Alert.alert('Error', 'Hubo un problema al actualizar.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        editTransaction,
        updateDetail,
        setEditTransaction,
        saveTransaction,
        isSaving,
    };
};
