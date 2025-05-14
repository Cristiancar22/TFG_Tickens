import { useState } from 'react';
import { Alert } from 'react-native';
import { Transaction, TransactionDetail } from '@/types';
import { updateTransaction } from '@/services/transaction.service';

export const useTransactionEdit = (initialTransaction: Transaction) => {
    const [editTransaction, setEditTransaction] =
        useState<Transaction>(initialTransaction);
    const [isSaving, setIsSaving] = useState(false);

    const updateHeader = (
        data: Partial<Pick<Transaction, 'store' | 'purchaseDate'>>,
    ) => {
        setEditTransaction((prev) => ({
            ...prev,
            ...data,
        }));
    };

    const updateDetail = (
        index: number,
        detail: Partial<TransactionDetail>,
    ) => {
        setEditTransaction((prev) => {
            const updatedDetails = [...(prev.details || [])];
            updatedDetails[index] = { ...updatedDetails[index], ...detail };
            return { ...prev, details: updatedDetails };
        });
    };

    const addDetail = (detail: TransactionDetail) => {
        setEditTransaction((prev) => {
            const exists = prev.details?.some(
                (d) =>
                    d.product === detail.product &&
                    d.quantity === detail.quantity &&
                    d.unitPrice === detail.unitPrice &&
                    d.subtotal === detail.subtotal,
            );

            if (exists) return prev;

            return {
                ...prev,
                details: [...(prev.details || []), detail],
            };
        });
    };

    const removeDetail = (index: number) => {
        setEditTransaction((prev) => {
            const updatedDetails = [...(prev.details || [])];
            updatedDetails.splice(index, 1);
            return { ...prev, details: updatedDetails };
        });
    };

    const saveTransaction = async () => {
        setIsSaving(true);
        try {
            const purifiedTransaction = {
                ...editTransaction,
                details: editTransaction.details?.filter(
                    (detail) => detail.product || detail.unitPrice > 0,
                ).map((detail) => ({
                    ...detail,
                    subtotal: detail.quantity * detail.unitPrice,
                })),
            };

            setEditTransaction(purifiedTransaction);

            await updateTransaction(editTransaction._id, purifiedTransaction);
            Alert.alert('Éxito', 'Transacción actualizada correctamente.');
            return true;
        } catch (error) {
            console.error('Error actualizando transacción:', error);
            Alert.alert('Error', 'Hubo un problema al actualizar.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        editTransaction,
        setEditTransaction,
        updateHeader,
        updateDetail,
        addDetail,
        removeDetail,
        saveTransaction,
        isSaving,
    };
};
