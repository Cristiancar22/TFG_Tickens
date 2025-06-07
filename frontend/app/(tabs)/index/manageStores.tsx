import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStores } from '@/store/useStore';
import { AddStoreModal } from '@/components/modals/AddStoreModal';
import { StoreList } from '@/components/manageStore';
import { Store } from '../../../types/store';
import { colors } from '@/constants/colors';
import { SelectMainStoreModal } from '@/components/modals/CustomStoreSelect';

export const ManageStoreScreen = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [isGroupingMode, setGroupingMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectMainModalVisible, setSelectMainModalVisible] =
        useState(false);

    const createStore = useStores((s) => s.createStore);
    const updateStore = useStores((s) => s.updateStore);
    const groupStores = useStores((s) => s.groupStores);

    useEffect(() => {
        if (!isGroupingMode) {
            setSelectedIds([]);
        }
    }, [isGroupingMode]);

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

    const onToggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((sid) => sid !== id)
                : [...prev, id],
        );
    };

    return (
        <View className="flex-1 bg-white">
            <Text className="text-xl font-bold p-4">Tus tiendas</Text>

            <Pressable onPress={() => setGroupingMode(!isGroupingMode)}>
                <Text style={{ padding: 10 }}>
                    {isGroupingMode ? 'Cancelar agrupación' : 'Agrupar tiendas'}
                </Text>
            </Pressable>

            {isGroupingMode && selectedIds.length >= 2 && (
                <Pressable
                    onPress={() => setSelectMainModalVisible(true)}
                    style={{ padding: 10 }}
                >
                    <Text style={{ color: 'black' }}>
                        Agrupar seleccionadas
                    </Text>
                </Pressable>
            )}

            <StoreList
                onEditStore={handleOpenEdit}
                isGroupingMode={isGroupingMode}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
            />

            <Pressable style={styles.floatingButton} onPress={handleOpenCreate}>
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            <AddStoreModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                store={selectedStore}
            />

            <SelectMainStoreModal
                visible={isSelectMainModalVisible}
                selectedIds={selectedIds}
                onSelectMain={async (mainId) => {
                    await groupStores(mainId, selectedIds);
                    setSelectMainModalVisible(false);
                    setGroupingMode(false);
                    setSelectedIds([]);
                }}
                onCancel={() => setSelectMainModalVisible(false)}
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
