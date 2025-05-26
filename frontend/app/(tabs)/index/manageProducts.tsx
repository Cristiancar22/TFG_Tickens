import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/store/useProduct';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { ProductList } from '@/components/manageProducts';
import { Product } from '@/types';
import { colors } from '@/constants/colors';
import { SelectMainProductModal } from '@/components/modals/CustomProductSelect';

export const ManageProductScreen = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );

    const [isGroupingMode, setGroupingMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const createProduct = useProducts((s) => s.createProduct);
    const updateProduct = useProducts((s) => s.updateProduct);
    const groupProducts = useProducts((s) => s.groupProducts);

    const [isSelectMainModalVisible, setSelectMainModalVisible] =
        useState(false);

    useEffect(() => {
        setSelectedIds([]);
    }, [isGroupingMode]);

    const handleOpenCreate = () => {
        setSelectedProduct(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleSubmit = async (data: Omit<Product, 'id'>) => {
        if (selectedProduct) {
            await updateProduct(selectedProduct.id, data);
        } else {
            await createProduct(data);
        }
    };

    const onToggleSelect = (id: string) => {
        setSelectedIds((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    return (
        <View className="flex-1 bg-white">
            <Text className="text-xl font-bold p-4">Tus productos</Text>
            <Pressable onPress={() => setGroupingMode(!isGroupingMode)}>
                <Text style={{ padding: 10 }}>
                    {isGroupingMode
                        ? 'Cancelar agrupación'
                        : 'Agrupar productos'}
                </Text>
            </Pressable>
            {isGroupingMode && selectedIds.length >= 2 && (
                <Pressable
                    onPress={() => setSelectMainModalVisible(true)}
                    style={{ padding: 10 }}
                >
                    <Text style={{ color: 'black' }}>
                        Agrupar seleccionados
                    </Text>
                </Pressable>
            )}
            <ProductList
                onEditProduct={handleOpenEdit}
                isGroupingMode={isGroupingMode}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
            />

            <Pressable style={styles.floatingButton} onPress={handleOpenCreate}>
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            <AddProductModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                product={selectedProduct}
            />
            <SelectMainProductModal
                visible={isSelectMainModalVisible}
                selectedIds={selectedIds}
                onSelectMain={async(mainId) => {
                    await groupProducts(mainId, selectedIds);
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

export default ManageProductScreen;
