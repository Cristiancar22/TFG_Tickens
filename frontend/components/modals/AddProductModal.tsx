import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InputField } from '@/components/ui/InputField';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string }) => Promise<void>;
    loading?: boolean;
}

export const AddProductModal: React.FC<Props> = ({
    isVisible,
    onClose,
    onSubmit,
    loading = false,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = async () => {
        if (!name.trim()) return alert('El nombre es obligatorio');
        await onSubmit({ name, description });
        setName('');
        setDescription('');
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            useNativeDriver
            style={styles.modal}
        >
            <View className="bg-white p-6 rounded-2xl w-full max-w-md">
                <Text className="text-lg font-semibold mb-4">
                    Añadir producto
                </Text>

                <InputField
                    label="Nombre"
                    placeholder="Nombre del producto"
                    value={name}
                    onChangeText={setName}
                />

                <InputField
                    label="Descripción"
                    placeholder="Descripción (opcional)"
                    value={description}
                    onChangeText={setDescription}
                />

                <PrimaryButton
                    title={loading ? 'Creando...' : 'Crear producto'}
                    disabled={loading}
                    onPress={handleSave}
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
