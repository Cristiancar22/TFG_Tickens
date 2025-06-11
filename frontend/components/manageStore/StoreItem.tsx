import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Store } from '@/types';
import { useStoreManager } from '@/hooks/manageStore/useStoreManager';

type Props = {
    store: Store;
    onEdit: (store: Store) => void;
    isGroupingMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
};

export const StoreItem = ({
    store,
    onEdit,
    isGroupingMode,
    isSelected,
    onToggleSelect,
}: Props) => {
    const { handleDelete } = useStoreManager();

    return (
        <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200"
            style={{
                backgroundColor: isSelected ? '#e0f7fa' : '#fff',
            }}
            onPress={() => isGroupingMode && onToggleSelect?.(store.id)}
            accessibilityLabel={`store-item-${store.id}`}
        >
            <Text
                className="text-base flex-1"
                accessibilityLabel={`store-name-${store.id}`}
            >
                {store.name}
            </Text>

            {!isGroupingMode && (
                <View className="flex-row items-center space-x-3">
                    {/* Botón de editar */}
                    <TouchableOpacity
                        className="bg-primary rounded-full p-2 shadow-lg"
                        onPress={() => onEdit(store)}
                        accessibilityLabel={`edit-store-${store.id}`}
                    >
                        <Ionicons name="pencil" size={17} color="#fff" />
                    </TouchableOpacity>

                    {/* Botón de eliminar */}
                    <TouchableOpacity
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
                        accessibilityLabel={`delete-store-${store.id}`}
                    >
                        <Ionicons name="trash" size={17} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};
