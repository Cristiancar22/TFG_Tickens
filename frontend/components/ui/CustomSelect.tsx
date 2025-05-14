import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useState } from 'react';

type CustomSelectProps<T extends { id: string; name: string }> = {
    label: string;
    items: T[];
    selectedId: string | null;
    onChange: (id: string) => void;
    getById: (id: string) => T | undefined;
};

export const CustomSelect = <T extends { id: string; name: string }>({
    label,
    items,
    selectedId,
    onChange,
    getById,
}: CustomSelectProps<T>) => {
    const [query, setQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const selectedItem = selectedId ? getById(selectedId) : null;

    const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <View className="mb-4">
            <Text className="font-semibold mb-1">{label}</Text>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="border rounded p-2 bg-gray-100"
            >
                <Text>
                    {selectedItem?.name ?? `Selecciona ${label.toLowerCase()}`}
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback
                        onPress={() => Keyboard.dismiss()}
                    >
                        <View style={styles.dropdownContainer}>
                            <TextInput
                                placeholder={`Buscar ${label.toLowerCase()}...`}
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
                                    <Pressable
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
                                    </Pressable>
                                )}
                            />
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="mt-2 py-2 px-4 bg-gray-300 rounded"
                            >
                                <Text className="text-center">Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Pressable>
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
