import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/store/useProduct';
import { colors } from '@/constants/colors';

type Props = {
    visible: boolean;
    selectedIds: string[];
    onSelectMain: (id: string) => void;
    onCancel: () => void;
};

export const SelectMainProductModal = ({
    visible,
    selectedIds,
    onSelectMain,
    onCancel,
}: Props) => {
    const getProductById = useProducts((s) => s.getProductById);

    const selectedProducts = selectedIds
        .map((id) => getProductById(id))
        .filter((p): p is { id: string; name: string } => p !== undefined);

    const handleSelect = (id: string) => {
        onSelectMain(id);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            accessibilityLabel="select-main-product-modal"
        >
            <View
                style={styles.container}
                accessibilityLabel="select-main-product-container"
            >
                <Text
                    style={styles.title}
                    accessibilityLabel="select-main-product-title"
                >
                    Selecciona el producto principal
                </Text>

                <FlatList
                    data={selectedProducts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.productItem}
                            onPress={() => handleSelect(item.id)}
                            accessibilityLabel={`product-option-${item.name}`}
                        >
                            <Ionicons
                                name="cube-outline"
                                size={20}
                                color="#333"
                                style={{ marginRight: 10 }}
                            />
                            <Text
                                style={styles.productText}
                                accessibilityLabel={`product-name-${item.name}`}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    accessibilityLabel="product-options-list"
                />

                <TouchableOpacity
                    onPress={onCancel}
                    style={styles.cancelButton}
                    accessibilityLabel="cancel-select-main-product"
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
