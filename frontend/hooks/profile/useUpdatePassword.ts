import { useState } from 'react';
import { changePassword } from '@/services/profile.service';
import { Alert } from 'react-native';

type UpdatePasswordData = {
    currentPassword: string;
    newPassword: string;
};

export const useUpdatePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (data: UpdatePasswordData) => {
        try {
            setLoading(true);
            setError(null);

            await changePassword(data);

            Alert.alert('Perfil actualizado');
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : 'Error inesperado';

            setError(errorMessage);
            Alert.alert('Error', errorMessage);
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
