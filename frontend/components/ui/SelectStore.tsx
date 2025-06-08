import { useStores } from '@/store/useStore';
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';

type Props = {
    selectedId: string | null;
    onChange: (id: string) => void;
};

export const SelectStore = ({ selectedId, onChange }: Props) => {
    const { stores, getStoreById } = useStores();
    const [query, setQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const selectedStore = selectedId ? getStoreById(selectedId) : null;

    const filtered = stores.filter((store) =>
        store.name.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <View className="mb-4">
            <Text className="font-semibold mb-1">Tienda</Text>

            {/* Zona de selección */}
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="border rounded p-2 bg-gray-100"
            >
                <Text>{selectedStore?.name ?? 'Selecciona una tienda'}</Text>
            </TouchableOpacity>

            {/* Modal desplegable */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.dropdownContainer}>
                        <TextInput
                            placeholder="Buscar tienda..."
                            value={query}
                            onChangeText={setQuery}
                            className="border-b p-2"
                        />
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.id}
                            keyboardShouldPersistTaps="handled"
                            style={{ maxHeight: 300 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onChange(item.id);
                                        setModalVisible(false);
                                        setQuery('');
                                    }}
                                    className={`p-2 ${
                                        selectedId === item.id
                                            ? 'bg-primary'
                                            : 'bg-white'
                                    }`}
                                >
                                    <Text
                                        className={
                                            selectedId === item.id
                                                ? 'text-white'
                                                : 'text-black'
                                        }
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="mt-2 py-2 px-4 bg-gray-300 rounded"
                        >
                            <Text className="text-center">Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 10,
    },
});
