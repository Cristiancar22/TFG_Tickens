import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useStores } from '@/store/useStore';

type Props = {
    visible: boolean;
    selectedIds: string[];
    onSelectMain: (id: string) => void;
    onCancel: () => void;
};

export const SelectMainStoreModal = ({
    visible,
    selectedIds,
    onSelectMain,
    onCancel,
}: Props) => {
    const getStoreById = useStores((s) => s.getStoreById);

    const selectedStores = selectedIds
        .map((id) => getStoreById(id))
        .filter((p): p is { id: string; name: string } => p !== undefined);

    const handleSelect = (id: string) => {
        onSelectMain(id);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            accessibilityLabel="select-main-store-modal"
        >
            <View
                style={styles.container}
                accessibilityLabel="select-main-store-container"
            >
                <Text
                    style={styles.title}
                    accessibilityLabel="select-main-store-title"
                >
                    Selecciona la tienda principal
                </Text>

                <FlatList
                    data={selectedStores}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.productItem}
                            onPress={() => handleSelect(item.id)}
                            accessibilityLabel={`store-option-${item.name}`}
                        >
                            <Ionicons
                                name="cube-outline"
                                size={20}
                                color="#333"
                                style={{ marginRight: 10 }}
                            />
                            <Text
                                style={styles.productText}
                                accessibilityLabel={`store-name-${item.name}`}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    accessibilityLabel="store-options-list"
                />

                <TouchableOpacity
                    onPress={onCancel}
                    style={styles.cancelButton}
                    accessibilityLabel="cancel-select-main-store"
                >
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    productText: {
        fontSize: 16,
        color: '#333',
    },
    cancelButton: {
        marginTop: 20,
        padding: 14,
        backgroundColor: colors.danger,
        borderRadius: 8,
    },
    cancelText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
});
