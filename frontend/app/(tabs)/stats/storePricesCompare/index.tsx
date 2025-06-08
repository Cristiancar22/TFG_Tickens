import { useState } from 'react';
import { useProducts } from '@/store/useProduct';
import { FlatList, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '@/types';

export const StorePricesCompareScreen = () => {
    const router = useRouter();

    const products = useProducts((s) => s.products);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleViewComparison = (product: Product) => {
        router.push(`stats/storePricesCompare/${product.id}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Text className="text-xl font-bold p-4">
                Selecciona un producto
            </Text>

            <TextInput
                placeholder="Buscar producto..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={{
                    padding: 10,
                    margin: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 8,
                }}
            />

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleViewComparison(item)}
                        style={{
                            padding: 12,
                            borderBottomColor: '#eee',
                            borderBottomWidth: 1,
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>
                            {item.name}
                        </Text>
                        {item.brand && (
                            <Text style={{ color: 'gray', marginTop: 4 }}>
                                Marca: {item.brand}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: 'gray' }}>No hay productos</Text>
                    </View>
                }
            />
        </View>
    );
};

export default StorePricesCompareScreen;
