import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getTransactionById } from '@/services/transaction.service';
import { Text, View, ActivityIndicator, ScrollView } from 'react-native';

export default function TransactionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getTransactionById(id)
                .then((tx) => {
                    setTransaction(tx);
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

    if (loading) {
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
        <ScrollView className="flex-1 p-4 bg-white">
            <Text className="text-xl font-bold mb-2">
                Tienda: {transaction.tienda?.name}
            </Text>
            <Text>Total: {transaction.total} €</Text>
            <Text>
                Fecha: {new Date(transaction.purchaseDate).toLocaleDateString()}
            </Text>

            <Text className="mt-4 font-bold">Productos:</Text>
            {transaction.detalles?.map((detalle: any, idx: number) => (
                <View key={idx} className="mt-2 border-b pb-2 border-gray-300">
                    <Text>Producto: {detalle.producto.name}</Text>
                    <Text>Cantidad: {detalle.quantity}</Text>
                    <Text>Precio unitario: {detalle.unitPrice} €</Text>
                    <Text>Subtotal: {detalle.subtotal} €</Text>
                </View>
            ))}
        </ScrollView>
    );
}
