import { useState } from 'react';
import { useNavigation } from 'expo-router';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useStores } from '@/store/useStore';
import { useProducts } from '@/store/useProduct';
import { TransactionDetailEditItem } from '@/components/transactions/TransactionDetailEditItem';
import { TransactionHeader } from '@/components/transactions/TransactionHeader';
import { Transaction, TransactionDetail } from '@/types';
import { createTransaction } from '@/services/transaction.service';

export const NewTransactionScreen = () => {
    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [editTransaction, setEditTransaction] = useState<
        Omit<Transaction, '_id'>
    >({
        store: '',
        purchaseDate: new Date().toLocaleDateString(),
        details: [],
        total: 0,
    });

    const { stores, getStoreById } = useStores();
    const { products, getProductById } = useProducts();

    const updateHeader = (data: Partial<Transaction>) => {
        setEditTransaction((prev) => ({ ...prev, ...data }));
    };

    const updateDetail = (
        index: number,
        detail: Partial<TransactionDetail>,
    ) => {
        setEditTransaction((prev) => {
            const updated = [...(prev.details || [])];
            updated[index] = { ...updated[index], ...detail };
            return { ...prev, details: updated };
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
            const updated = [...(prev.details || [])];
            updated.splice(index, 1);
            return { ...prev, details: updated };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const purifiedTransaction = {
                ...editTransaction,
                details: (editTransaction.details || [])
                    .filter((d) => d.product || d.unitPrice > 0)
                    .map((d) => ({
                        ...d,
                        subtotal: d.quantity * d.unitPrice,
                    })),
            };

            const total = purifiedTransaction.details.reduce(
                (acc, d) => acc + d.subtotal,
                0,
            );

            const newTransaction = {
                ...purifiedTransaction,
                total,
            };

            await createTransaction(newTransaction);

            Alert.alert('Éxito', 'Transacción creada correctamente.');
            navigation.goBack();
        } catch (err) {
            console.error('Error creando transacción:', err);
            Alert.alert('Error', 'No se pudo crear la transacción.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isSaving) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <>
            <TransactionHeader
                editMode={true}
                storeId={editTransaction.store}
                stores={stores}
                getStoreById={getStoreById}
                purchaseDate={editTransaction.purchaseDate}
                onStoreChange={(id) => updateHeader({ store: id })}
                onDateChange={(date) => updateHeader({ purchaseDate: date })}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                total={editTransaction.total || 0}
            />

            <ScrollView
                className="flex-1 p-4 bg-white"
                contentContainerStyle={{ paddingBottom: 90 }}
            >
                <Text className="mt-4 font-bold">Productos:</Text>

                {(editTransaction.details || []).map((detail, idx) => (
                    <TransactionDetailEditItem
                        key={idx}
                        productId={detail.product || null}
                        quantity={detail.quantity}
                        unitPrice={detail.unitPrice}
                        onUpdate={(updated) =>
                            updateDetail(idx, {
                                ...(updated.productId && {
                                    product: updated.productId,
                                }),
                                ...(updated.quantity !== undefined && {
                                    quantity: updated.quantity,
                                }),
                                ...(updated.unitPrice !== undefined && {
                                    unitPrice: updated.unitPrice,
                                }),
                            })
                        }
                        onRemove={() => removeDetail(idx)}
                        products={products}
                        getProductById={getProductById}
                    />
                ))}

                <TouchableOpacity
                    onPress={() =>
                        addDetail({
                            product: '',
                            quantity: 1,
                            unitPrice: 0,
                            subtotal: 0,
                        } as TransactionDetail)
                    }
                    className="mt-4 py-3 rounded-xl"
                    style={{ backgroundColor: colors.accent }}
                >
                    <Text className="text-white text-center text-base font-semibold">
                        Añadir producto
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Ionicons
                    name="save-outline"
                    size={25}
                    color={colors.background}
                />
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    saveButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 8,
        elevation: 5,
    },
});

export default NewTransactionScreen;
