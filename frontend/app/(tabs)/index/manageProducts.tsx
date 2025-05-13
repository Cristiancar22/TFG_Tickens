import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/store/useProduct';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { ProductList } from '@/components/manageProducts';
import { Product } from '@/types';

export const ManageProductScreen = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const createProduct = useProducts((s) => s.createProduct);
    const updateProduct = useProducts((s) => s.updateProduct);

    const handleOpenCreate = () => {
        setSelectedProduct(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleSubmit = async (data: Omit<Product, 'id'>) => {
        if (selectedProduct) {
            await updateProduct(selectedProduct.id, data);
        } else {
            await createProduct(data);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Text className="text-xl font-bold p-4">Tus productos</Text>

            <ProductList onEditProduct={handleOpenEdit} />

            <Pressable
                className="absolute bottom-6 right-6 bg-primary rounded-full p-4 shadow-lg"
                onPress={handleOpenCreate}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            <AddProductModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                product={selectedProduct}
            />
        </View>
    );
};

export default ManageProductScreen;
