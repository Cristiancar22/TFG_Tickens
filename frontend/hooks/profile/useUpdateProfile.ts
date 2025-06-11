import { useState } from 'react';
import { updateProfile } from '@/services/profile.service';
import { EditProfileSchema } from '@/schemas/editProfile.schema';
import { Alert } from 'react-native';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'expo-router';

export const useUpdateProfile = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setUser = useAuth((s) => s.setUser);

    const handleUpdate = async (data: EditProfileSchema) => {
        try {
            setLoading(true);
            setError(null);

            const updatedUser = await updateProfile(data);
            setUser(updatedUser);
            router.back();
            Alert.alert('Cambios guardados', 'Tu perfil ha sido actualizado correctamente');
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
