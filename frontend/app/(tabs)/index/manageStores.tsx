import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStores } from '@/store/useStore';
import { AddStoreModal } from '@/components/modals/AddStoreModal';
import { StoreList } from '@/components/manageStore';

export const ManageStoreScreen = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const createStore = useStores((s) => s.createStore);

    return (
        <View className="flex-1 bg-white">
            <Text className="text-xl font-bold p-4">Tus tiendas</Text>

            <StoreList />

            {/* Botón flotante */}
            <Pressable
                className="absolute bottom-6 right-6 bg-primary rounded-full p-4 shadow-lg"
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            {/* Modal de añadir tienda */}
            <AddStoreModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={createStore}
            />
        </View>
    );
};

export default ManageStoreScreen;
