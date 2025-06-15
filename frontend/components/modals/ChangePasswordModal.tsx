import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InputField } from '../ui/InputField';

interface Props {
    isVisible: boolean;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (data: {
        currentPassword: string;
        newPassword: string;
    }) => Promise<void>;
}

export const ChangePasswordModal: React.FC<Props> = ({
    isVisible,
    onClose,
    onSubmit,
    loading = false,
}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Las contraseñas no coinciden');
            return;
        }

        await onSubmit({ currentPassword, newPassword });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            useNativeDriver
            style={styles.modal}
            accessibilityLabel="change-password-modal"
        >
            <View
                className="bg-white p-6 rounded-2xl w-full max-w-md"
                accessibilityLabel="change-password-container"
            >
                <Text
                    className="text-lg font-semibold mb-4"
                    accessibilityLabel="change-password-title"
                >
                    Cambiar contraseña
                </Text>

                <InputField
                    label="Contraseña actual"
                    placeholder="Contraseña actual"
                    secure
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    autoCapitalize="none"
                    accessibilityLabel="input-current-password"
                />

                <InputField
                    label="Nueva contraseña"
                    placeholder="Nueva contraseña"
                    secure
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                    accessibilityLabel="input-new-password"
                />

                <InputField
                    label="Confirmar contraseña"
                    placeholder="Confirmar contraseña"
                    secure
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                    accessibilityLabel="input-confirm-password"
                />

                <PrimaryButton
                    title={loading ? 'Guardando...' : 'Guardar cambios'}
                    disabled={loading}
                    onPress={handleSave}
                    accessibilityLabel="submit-password-change"
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
