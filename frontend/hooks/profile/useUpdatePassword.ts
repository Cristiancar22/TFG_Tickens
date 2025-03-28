import { useState } from 'react';
import { changePassword } from '@/services/profile.service';
import { Alert } from 'react-native';

type UpdatePasswordData = {
    currentPassword: string;
    newPassword: string;
}

export const useUpdatePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (data: UpdatePasswordData) => {
        try {
            setLoading(true);
            setError(null);

            await changePassword(data);

            Alert.alert('Perfil actualizado');
        } catch (err: any) {
            setError(err.message || 'Error inesperado');
            Alert.alert('Error', err.message || 'Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return {
        update: handleUpdate,
        loading,
        error,
    };
};
