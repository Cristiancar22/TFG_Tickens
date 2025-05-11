import { useProducts } from '@/store/useProduct';
import { ProductItem } from './ProductItem';
import { FlatList } from 'react-native';

export const ProductList = () => {
    const products = useProducts((s) => s.products);

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductItem product={item} />}
        />
    );
};
