import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getTransactionById } from '@/services/transaction.service';
import { TransactionDetailItem } from '@/components/transactions';
import { Ionicons } from '@expo/vector-icons';
import {
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Transaction } from '@/types';
import { useTransactionEdit } from '@/hooks/transactions/useTransactionEdit';
import { useStores } from '@/store/useStore';
import { useProducts } from '@/store/useProduct';

export default function TransactionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const {
        editTransaction,
        updateDetail,
        setEditTransaction,
        saveTransaction,
        isSaving,
    } = useTransactionEdit(transaction as Transaction);
    const { getStoreById } = useStores();
    const { getProductById } = useProducts();

    const store = transaction?.store ? getStoreById(transaction.store) : null;

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
        if (success) setEditMode(false);
    };

    if (loading || isSaving) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
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
            <ScrollView className="flex-1 p-4 bg-white">
                <Text className="text-xl font-bold mb-2">
                    Tienda: {store?.name ?? 'Tienda desconocida'}
                </Text>
                <Text>Total: {transaction.total.toFixed(2)} €</Text>
                <Text>
                    Fecha:{' '}
                    {new Date(transaction.purchaseDate).toLocaleDateString()}
                </Text>

                <Text className="mt-4 font-bold">Productos:</Text>
                {editTransaction.details?.map((detail, idx) => {
                    const product = detail?.product
                        ? getProductById(detail.product)
                        : null;

                    return editMode ? (
                        <View
                            key={idx}
                            className="border-b border-gray-300 pb-2 mb-2"
                        >
                            <Text className="font-semibold">
                                Producto:{' '}
                                {product?.name ?? 'Producto desconocido'}
                            </Text>
                            <TextInput
                                value={String(detail.quantity)}
                                keyboardType="numeric"
                                onChangeText={(text) =>
                                    updateDetail(idx, {
                                        quantity: Number(text),
                                    })
                                }
                                className="border rounded p-2 my-1"
                            />
                            <TextInput
                                value={detail.unitPrice.toString()}
                                keyboardType="decimal-pad"
                                onChangeText={(text) =>
                                    updateDetail(idx, {
                                        unitPrice: parseFloat(text),
                                    })
                                }
                                className="border rounded p-2 my-1"
                            />
                            <Text>
                                Subtotal:{' '}
                                {(detail.quantity * detail.unitPrice).toFixed(
                                    2,
                                )}{' '}
                                €
                            </Text>
                        </View>
                    ) : (
                        <TransactionDetailItem
                            key={idx}
                            detail={detail}
                            productName={
                                product?.name ?? 'Producto desconocido'
                            }
                        />
                    );
                })}
            </ScrollView>

            <TouchableOpacity
                onPress={editMode ? handleSave : () => setEditMode(true)}
                style={styles.editButton}
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
