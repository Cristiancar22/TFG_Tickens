import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useProductManager } from '@/hooks/manageProduct/useProductManager';

type Props = {
    product: Product;
};

export const ProductItem = ({ product }: Props) => {
    const { handleEdit, handleDelete } = useProductManager();

    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            {/* Nombre del producto */}
            <Text className="text-base flex-1">{product.name}</Text>

            {/* Acciones */}
            <View className="flex-row items-center space-x-3">
                <Pressable
                    className="bg-primary rounded-full p-2 shadow-lg"
                    onPress={() => handleEdit(product)}
                >
                    <Ionicons name="pencil" size={17} color="#fff" />
                </Pressable>
                <Pressable className="bg-primary rounded-full p-2 shadow-lg ml-2" onPress={() => handleDelete(product.id)}>
                    <Ionicons name="trash" size={17} color="#fff" />
                </Pressable>
            </View>
        </View>
    );
};
