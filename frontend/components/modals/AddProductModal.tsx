import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InputField } from '@/components/ui/InputField';
import { Product } from '@/types';
import { CustomCategorySelect } from '../ui/CustomCategorySelect';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description?: string;
        category?: string;
    }) => Promise<void>;
    product?: Product | null;
    loading?: boolean;
}

export const AddProductModal: React.FC<Props> = ({
    isVisible,
    onClose,
    onSubmit,
    product,
    loading = false,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description || '');
            setCategory(product.category || '');
        } else {
            setName('');
            setDescription('');
            setCategory('');
        }
    }, [product]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('El nombre es obligatorio');
            return;
        }
        await onSubmit({ name, description, category });
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            useNativeDriver
            style={styles.modal}
            accessibilityLabel="add-product-modal"
        >
            <View
                className="bg-white p-6 rounded-2xl w-full max-w-md"
                accessibilityLabel="add-product-container"
            >
                <Text
                    className="text-lg font-semibold mb-4"
                    accessibilityLabel="add-product-title"
                >
                    {product ? 'Editar producto' : 'Añadir producto'}
                </Text>

                <InputField
                    label="Nombre"
                    placeholder="Nombre del producto"
                    value={name}
                    onChangeText={setName}
                    accessibilityLabel="add-product-name-input"
                />

                <InputField
                    label="Descripción"
                    placeholder="Descripción (opcional)"
                    value={description}
                    onChangeText={setDescription}
                    accessibilityLabel="add-product-description-input"
                />

                <CustomCategorySelect
                    selectedId={category}
                    onChange={setCategory}
                    label="Categoría"
                    accessibilityLabel="add-product-category-select"
                />

                <PrimaryButton
                    title={
                        loading
                            ? 'Guardando...'
                            : product
                              ? 'Guardar cambios'
                              : 'Crear producto'
                    }
                    disabled={loading}
                    onPress={handleSave}
                    accessibilityLabel="add-product-submit-button"
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
