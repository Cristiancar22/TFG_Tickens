import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '@/store/useCategories';
import { colors } from '@/constants/colors';

type Props = {
    selectedId: string | null;
    onChange: (id: string) => void;
    label?: string;
    accessibilityLabel?: string;
};

export const CustomCategorySelect = ({ selectedId, onChange, label, accessibilityLabel }: Props) => {
    const { categories, getCategoryById } = useCategories();
    const selectedCategory = selectedId ? getCategoryById(selectedId) : null;

    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (id: string) => {
        onChange(id);
        setModalVisible(false);
    };

    return (
        <View className="mb-4" accessibilityLabel={accessibilityLabel}>
            {label && <Text className="mb-1 font-semibold">{label}</Text>}

            <TouchableOpacity
                className="flex-row items-center justify-between border p-3 rounded"
                style={{ borderColor: '#ccc' }}
                onPress={() => setModalVisible(true)}
            >
                <View className="flex-row items-center">
                    {selectedCategory && (
                        <Ionicons
                            name={selectedCategory.icon || 'pricetag-outline'}
                            size={20}
                            color={selectedCategory.secondaryColor || colors.text}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Text>
                        {selectedCategory?.name || 'Seleccionar categoría'}
                    </Text>
                </View>
                <Ionicons name="chevron-down-outline" size={20} color="#888" />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View className="flex-1 bg-white p-4">
                    <Text className="text-xl font-bold mb-4">Selecciona una categoría</Text>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="flex-row items-center p-3 rounded mb-2"
                                style={{
                                    backgroundColor: item.primaryColor || '#F0F0F0',
                                }}
                                onPress={() => handleSelect(item._id)}
                            >
                                <Ionicons
                                    name={item.icon || 'pricetag-outline'}
                                    size={20}
                                    color={item.secondaryColor || '#000'}
                                    style={{ marginRight: 10 }}
                                />
                                <Text style={{ color: item.secondaryColor || '#000' }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className="mt-4 py-3 rounded-xl"
                        style={{ backgroundColor: colors.danger }}
                    >
                        <Text className="text-white text-center font-semibold">Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};
