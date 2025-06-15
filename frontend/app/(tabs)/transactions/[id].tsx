import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getTransactionById } from '@/services/transaction.service';
import { Ionicons } from '@expo/vector-icons';
import {
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Transaction, TransactionDetail } from '@/types';
import { useTransactionEdit } from '@/hooks/transactions/useTransactionEdit';
import { useStores } from '@/store/useStore';
import { useProducts } from '@/store/useProduct';
import { TransactionDetailEditItem } from '@/components/transactions/TransactionDetailEditItem';
import { TransactionDetailItem } from '@/components/transactions';
import { TransactionHeader } from '@/components/transactions/TransactionHeader';
export default function TransactionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    const {
        editTransaction,
        updateDetail,
        setEditTransaction,
        saveTransaction,
        isSaving,
        updateHeader,
        addDetail,
        removeDetail,
    } = useTransactionEdit(transaction as Transaction);

    const { stores, getStoreById } = useStores();
    const { products, getProductById } = useProducts();

    useEffect(() => {
        if (id) {
            getTransactionById(id)
                .then((tx) => {
                    setTransaction(tx);
                    setEditTransaction(tx);
                    if (tx.purchaseDate) {
                        const fecha = new Date(
                            tx.purchaseDate,
                        ).toLocaleDateString();
                        navigation.setOptions({
                            title: `Transacción del ${fecha}`,
                        });
                    }
                })
                .catch((err) => console.error('Error cargando detalle:', err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSave = async () => {
        const success = await saveTransaction();
        if (success) {
            const purifiedTransaction = {
                ...editTransaction,
                details: editTransaction.details
                    ?.filter((detail) => detail.product || detail.unitPrice > 0)
                    .map((detail) => ({
                        ...detail,
                        subtotal: detail.quantity * detail.unitPrice,
                    })),
            };
            setTransaction(purifiedTransaction);
            setEditMode(false);
        }
    };

    if (loading || isSaving) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" accessibilityLabel="ActivityIndicator" />
            </View>
        );
    }

    if (!transaction) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Transacción no encontrada</Text>
            </View>
        );
    }

    return (
        <>
            <TransactionHeader
                editMode={editMode}
                storeId={editTransaction.store}
                stores={stores}
                getStoreById={getStoreById}
                purchaseDate={editTransaction.purchaseDate}
                onStoreChange={(id) => updateHeader({ store: id })}
                onDateChange={(date) => updateHeader({ purchaseDate: date })}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                total={transaction.total}
            />

            <ScrollView
                className="flex-1 p-4 bg-white"
                contentContainerStyle={{ paddingBottom: 90 }}
            >
                <Text className="mt-4 font-bold">Productos:</Text>
                {(editMode
                    ? editTransaction.details
                    : transaction.details
                )?.map((detail, idx) => {
                    const product = detail?.product
                        ? getProductById(detail.product)
                        : null;

                    return editMode ? (
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
                    ) : (
                        <TransactionDetailItem
                            key={idx}
                            detail={detail}
                            product={product ?? undefined}
                        />
                    );
                })}

                {editMode && (
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
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Text className="text-white text-center text-base font-semibold">
                            Añadir producto
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <TouchableOpacity
                onPress={editMode ? handleSave : () => setEditMode(true)}
                style={styles.editButton}
                accessibilityLabel="edit-button"
            >
                <Ionicons
                    name={editMode ? 'save-outline' : 'pencil-outline'}
                    size={25}
                    color={colors.background}
                />
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    editButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 8,
        elevation: 5,
    },
});
