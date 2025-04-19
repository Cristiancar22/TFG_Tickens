import { Ionicons } from '@expo/vector-icons';
import { View, Image, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

type Props = {
    initialUri?: string;
    onChange: (uri: string) => void;
};

export const EditableAvatar = ({ initialUri, onChange }: Props) => {
    const [avatarUri, setAvatarUri] = useState(initialUri);

    const pickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            return Alert.alert(
                'Permisos requeridos',
                'Se necesita acceso a la galería',
            );
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            selectionLimit: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatarUri(uri);
            onChange(uri);
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return Alert.alert(
                'Permisos requeridos',
                'Se necesita acceso a la cámara',
            );
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatarUri(uri);
            onChange(uri);
        }
    };

    const openOptions = () => {
        Alert.alert('Seleccionar imagen', '¿Qué deseas hacer?', [
            { text: 'Tomar foto', onPress: takePhoto },
            { text: 'Elegir de galería', onPress: pickImage },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    return (
        <Pressable onPress={openOptions} className="self-center mb-4">
            {avatarUri ? (
                <Image
                    source={{ uri: avatarUri }}
                    className="w-24 h-24 rounded-full"
                />
            ) : (
                <Ionicons
                    name="person-circle-outline"
                    size={100}
                    color="#999"
                />
            )}
        </Pressable>
    );
};
