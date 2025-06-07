import { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getProductPriceComparison } from '@/services/product.service';
import { ProductPriceComparison } from '@/services/product.service';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { useProducts } from '@/store/useProduct';

export default function StorePricesCompareDetailScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();

    const getProductById = useProducts((s) => s.getProductById);
    const product =
        id && typeof id === 'string' ? getProductById(id) : undefined;

    const [comparisonData, setComparisonData] = useState<
        ProductPriceComparison[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComparison = async () => {
            if (!id || typeof id !== 'string') return;

            setIsLoading(true);
            setError(null);

            try {
                const data = await getProductPriceComparison(id);
                setComparisonData(data);
            } catch (err: unknown) {
                console.error('Error fetching price comparison:', err);
                setError('Error al obtener la comparación de precios');
            } finally {
                setIsLoading(false);
            }
        };

        fetchComparison();
    }, [id]);

    // 🏷️ Actualizar title del header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Precios de ${product?.name ?? ''}`,
        });
    }, [navigation, product?.name]);

    // 🏷️ Precio más bajo
    const minPrice = useMemo(() => {
        if (comparisonData.length === 0) return null;
        return Math.min(...comparisonData.map((entry) => entry.lastPrice));
    }, [comparisonData]);

    const renderItem = ({ item }: { item: ProductPriceComparison }) => {
        const isLowest = item.lastPrice === minPrice;

        return (
            <View
                style={{
                    padding: 16,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    backgroundColor: isLowest ? '#e7f7ec' : 'white', // verde muy sutil
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: isLowest ? 'bold' : '500',
                        color: isLowest ? '#2e7d32' : 'black',
                    }}
                >
                    {item.storeName}
                </Text>
                <Text style={{ marginTop: 4 }}>
                    Precio: {item.lastPrice.toFixed(2)} €
                </Text>
                <Text style={{ marginTop: 2, color: 'gray' }}>
                    Fecha:{' '}
                    {new Date(item.lastPurchaseDate).toLocaleDateString()}
                </Text>
                {isLowest && (
                    <Text
                        style={{
                            marginTop: 6,
                            color: '#2e7d32',
                            fontWeight: '600',
                        }}
                    >
                        🏆 Mejor precio
                    </Text>
                )}
            </View>
        );
    };

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10 }}>Cargando comparación...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                <Pressable onPress={() => router.back()}>
                    <Text style={{ color: '#007AFF' }}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {comparisonData.length === 0 ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'gray' }}>
                        No hay datos de compra para este producto.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={comparisonData}
                    keyExtractor={(item) => item.storeId}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 16 }}
                />
            )}
        </View>
    );
}
