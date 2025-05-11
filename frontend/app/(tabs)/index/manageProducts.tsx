import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/store/useProduct';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { ProductList } from '@/components/manageProducts';

export const ManageProductScreen = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const createProduct = useProducts((s) => s.createProduct);

    return (
        <View className="flex-1 bg-white">
            <Text className="text-xl font-bold p-4">Tus productos</Text>

            <ProductList />

            {/* Botón flotante */}
            <Pressable
                className="absolute bottom-6 right-6 bg-primary rounded-full p-4 shadow-lg"
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            {/* Modal de añadir producto */}
            <AddProductModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={createProduct}
            />
        </View>
    );
};

export default ManageProductScreen;
