import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useProductManager } from '@/hooks/manageProduct/useProductManager';

type Props = {
    product: Product;
    onEdit: (product: Product) => void;
};

export const ProductItem = ({ product, onEdit }: Props) => {
    const { handleDelete } = useProductManager();

    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="text-base flex-1">{product.name}</Text>

            <View className="flex-row items-center space-x-3">
                <Pressable
                    className="bg-primary rounded-full p-2 shadow-lg"
                    onPress={() => onEdit(product)}
                >
                    <Ionicons name="pencil" size={17} color="#fff" />
                </Pressable>
                <Pressable
                    className="bg-primary rounded-full p-2 shadow-lg ml-2"
                    onPress={() => {
                        Alert.alert(
                            'Confirmar eliminación',
                            `¿Estás seguro que quieres borrar el producto "${product.name}"?`,
                            [
                                { text: 'Cancelar', style: 'cancel' },
                                {
                                    text: 'Eliminar',
                                    style: 'destructive',
                                    onPress: () => handleDelete(product.id),
                                },
                            ],
                        );
                    }}
                >
                    <Ionicons name="trash" size={17} color="#fff" />
                </Pressable>
            </View>
        </View>
    );
};
