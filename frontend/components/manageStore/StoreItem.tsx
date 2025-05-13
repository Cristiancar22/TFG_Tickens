import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Store } from '@/types';
import { useStoreManager } from '@/hooks/manageStore/useStoreManager';

type Props = {
    store: Store;
    onEdit: (store: Store) => void;
};

export const StoreItem = ({ store, onEdit }: Props) => {
    const { handleDelete } = useStoreManager();

    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="text-base flex-1">{store.name}</Text>

            <View className="flex-row items-center space-x-3">
                <Pressable
                    className="bg-primary rounded-full p-2 shadow-lg"
                    onPress={() => onEdit(store)}
                >
                    <Ionicons name="pencil" size={17} color="#fff" />
                </Pressable>
                <Pressable
                    className="bg-primary rounded-full p-2 shadow-lg ml-2"
                    onPress={() => {
                        Alert.alert(
                            'Confirmar eliminación',
                            `¿Estás seguro que quieres borrar la tienda "${store.name}"?`,
                            [
                                { text: 'Cancelar', style: 'cancel' },
                                {
                                    text: 'Eliminar',
                                    style: 'destructive',
                                    onPress: () => handleDelete(store.id),
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
