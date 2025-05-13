import { useProducts } from '@/store/useProduct';
import { ProductItem } from './ProductItem';
import { FlatList, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Product } from '@/types';

interface Props {
    onEditProduct: (product: Product) => void;
}

export const ProductList = ({ onEditProduct }: Props) => {
    const products = useProducts((s) => s.products);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <View style={{ flex: 1 }}>
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
                    <ProductItem product={item} onEdit={onEditProduct} />
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

