import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStores } from '@/store/useStore';
import { AddStoreModal } from '@/components/modals/AddStoreModal';
import { StoreList } from '@/components/manageStore';
import { Store } from '../../../types/store';
import { colors } from '@/constants/colors';

export const ManageStoreScreen = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    const createStore = useStores((s) => s.createStore);
    const updateStore = useStores((s) => s.updateStore);

    const handleOpenCreate = () => {
        setSelectedStore(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (store: Store) => {
        setSelectedStore(store);
        setModalVisible(true);
    };

    const handleSubmit = async (data: Omit<Store, 'id'>) => {
        if (selectedStore) {
            await updateStore(selectedStore.id, data);
        } else {
            await createStore(data);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Text className="text-xl font-bold p-4">Tus tiendas</Text>

            <StoreList onEditStore={handleOpenEdit} />

            <Pressable style={styles.floatingButton} onPress={handleOpenCreate}>
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            <AddStoreModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                store={selectedStore}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 8,
        elevation: 5,
    },
});

export default ManageStoreScreen;
