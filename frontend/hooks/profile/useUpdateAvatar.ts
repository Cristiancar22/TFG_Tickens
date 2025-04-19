import { useAuth } from '@/store/useAuth';
import { api } from '@/services/api';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useUpdateAvatar = () => {
    const [loading, setLoading] = useState(false);
    const setUser = useAuth((s) => s.setUser);
    const token = useAuth((s) => s.token);

    const updateAvatar = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
                selectionLimit: 1,
            });

            if (result.canceled) return;

            const image = result.assets[0];
            setLoading(true);

            const formData = new FormData();
            formData.append('avatar', {
                uri: image.uri,
                type: image.mimeType || 'image/jpeg',
                name: 'avatar.jpg',
            } as any);

            const response = await api.patch('/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser((prev) => ({
                ...prev!,
                avatarUrl: response.data.avatarUrl,
            }));
        } catch (error: unknown) {
            return error;
        } finally {
            setLoading(false);
        }
    };

    return { updateAvatar, loading };
};
