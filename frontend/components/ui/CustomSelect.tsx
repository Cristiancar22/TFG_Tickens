import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Animated,
    Easing,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons'; // Usamos tus iconos

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

    // 👉 Animación
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (modalVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [modalVisible]);

    return (
        <View className="mb-4">
            <Text className="font-semibold mb-1 text-foreground">{label}</Text>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    borderWidth: 1,
                    borderColor: colors.primary,
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Text
                    style={{
                        color: selectedItem ? colors.text : '#999',
                        fontSize: 16,
                    }}
                >
                    {selectedItem?.name ?? `Selecciona ${label.toLowerCase()}`}
                </Text>

                <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color={colors.primary}
                />
            </TouchableOpacity>

            <Modal
                animationType="none" // usamos animación manual con fade
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback
                        onPress={() => Keyboard.dismiss()}
                    >
                        <Animated.View
                            style={[
                                styles.dropdownContainer,
                                { opacity: fadeAnim },
                            ]}
                        >
                            <TextInput
                                placeholder={`Buscar ${label.toLowerCase()}...`}
                                value={query}
                                onChangeText={setQuery}
                                style={{
                                    borderWidth: 1,
                                    borderColor: colors.primary,
                                    borderRadius: 8,
                                    padding: 10,
                                    marginBottom: 12,
                                }}
                            />

                            <FlatList
                                data={filtered}
                                keyExtractor={(item) => item.id}
                                keyboardShouldPersistTaps="handled"
                                style={{ maxHeight: 300 }}
                                renderItem={({ item }) => {
                                    const isSelected = selectedId === item.id;

                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                onChange(item.id);
                                                setModalVisible(false);
                                                setQuery('');
                                            }}
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 8,
                                                backgroundColor: isSelected
                                                    ? colors.primary
                                                    : '#fff',
                                                borderRadius: 6,
                                                marginBottom: 6,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: isSelected
                                                        ? '#fff'
                                                        : colors.text,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{
                                    marginTop: 16,
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                    backgroundColor: colors.secondary,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{ color: '#fff', fontWeight: '600' }}
                                >
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
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
