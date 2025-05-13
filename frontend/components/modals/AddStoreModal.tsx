import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InputField } from '@/components/ui/InputField';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; address?: string }) => Promise<void>;
    store?: { name: string; address?: string } | null;
    loading?: boolean;
}

export const AddStoreModal: React.FC<Props> = ({
    isVisible,
    onClose,
    onSubmit,
    store,
    loading = false,
}) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (store) {
            setName(store.name);
            setAddress(store.address || '');
        } else {
            setName('');
            setAddress('');
        }
    }, [store]);

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
