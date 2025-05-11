import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InputField } from '@/components/ui/InputField';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; address?: string }) => Promise<void>;
    loading?: boolean;
    defaultValues?: { name: string; address?: string };
}

export const AddStoreModal: React.FC<Props> = ({
    isVisible,
    onClose,
    onSubmit,
    loading = false,
    defaultValues,
}) => {
    const [name, setName] = useState(defaultValues?.name || '');
    const [address, setAddress] = useState(defaultValues?.address || '');

    const handleSave = async () => {
        if (!name.trim()) return alert('El nombre es obligatorio');
        await onSubmit({ name, address });
        setName('');
        setAddress('');
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
                <Text className="text-lg font-semibold mb-4">Añadir tienda</Text>

                <InputField
                    label="Nombre"
                    placeholder="Nombre de la tienda"
                    value={name}
                    onChangeText={setName}
                />

                <InputField
                    label="Dirección"
                    placeholder="Dirección (opcional)"
                    value={address}
                    onChangeText={setAddress}
                />

                <PrimaryButton
                    title={loading ? 'Guardando...' : 'Guardar tienda'}
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
