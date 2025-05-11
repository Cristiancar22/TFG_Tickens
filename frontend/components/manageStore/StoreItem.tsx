import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Store } from '@/types';
import { useStoreManager } from '@/hooks/manageStore/useStoreManager';

type Props = {
    store: Store;
};

export const StoreItem = ({ store }: Props) => {
    const { handleEdit, handleDelete } = useStoreManager();

    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="text-base flex-1">{store.name}</Text>
            <View className="flex-row items-center space-x-3">
                <Pressable onPress={() => handleEdit(store)}>
                    <Ionicons name="pencil" size={20} className="text-primary" />
                </Pressable>
                <Pressable onPress={() => handleDelete(store.id)}>
                    <Ionicons name="trash" size={20} className="text-red-500" />
                </Pressable>
            </View>
        </View>
    );
};
