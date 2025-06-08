import { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getProductPriceComparison } from '@/services/product.service';
import { ProductPriceComparison } from '@/services/product.service';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useProducts } from '@/store/useProduct';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Precios de ${product?.name ?? ''}`,
        });
    }, [navigation, product?.name]);

    const minPrice = useMemo(() => {
        if (comparisonData.length === 0) return null;
        return Math.min(...comparisonData.map((entry) => entry.lastPrice));
    }, [comparisonData]);

    const renderItem = ({ item }: { item: ProductPriceComparison }) => {
        const isLowest = item.lastPrice === minPrice;

        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: 16,
                    marginHorizontal: 16,
                    marginVertical: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 8,
                    elevation: 4,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                    }}
                >
                    <View
                        style={{
                            borderRadius: 20,
                            padding: 8,
                            marginRight: 12,
                            backgroundColor: '#f0f0f0',
                        }}
                    >
                        <Ionicons
                            name="storefront-outline"
                            size={24}
                            color={isLowest ? colors.accent : colors.primary}
                        />
                    </View>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: colors.text,
                            flexShrink: 1,
                        }}
                    >
                        {item.storeName}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 8,
                    }}
                >
                    <Text style={{ color: colors.foreground, fontSize: 14 }}>
                        Precio: {item.lastPrice.toFixed(2)} €
                    </Text>
                    <Text style={{ color: colors.foreground, fontSize: 14 }}>
                        {new Date(item.lastPurchaseDate).toLocaleDateString()}
                    </Text>
                </View>

                {isLowest && (
                    <View
                        style={{
                            marginTop: 10,
                            backgroundColor: '#e7f7ec',
                            borderRadius: 6,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Text
                            style={{
                                color: colors.accent,
                                fontSize: 12,
                                fontWeight: '600',
                            }}
                        >
                            🏆 Mejor precio
                        </Text>
                    </View>
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
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: '#007AFF' }}>Volver</Text>
                </TouchableOpacity>
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
