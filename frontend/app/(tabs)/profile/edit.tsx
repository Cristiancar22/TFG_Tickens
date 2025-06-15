import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { InputField } from '@/components/ui/InputField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useUpdateProfile } from '@/hooks/profile/useUpdateProfile';
import {
    EditProfileSchema,
    editProfileSchema,
} from '@/schemas/editProfile.schema';
import { useAuth } from '@/store/useAuth';

export const EditProfileScreen = () => {
    const user = useAuth((s) => s.user);
    const { update, loading } = useUpdateProfile();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EditProfileSchema>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || '',
            });
        }
    }, [user]);

    return (
        <View
            className="flex-1 p-6 bg-background"
            accessibilityLabel="edit-profile-screen"
        >
            <Text
                className="text-xl font-semibold mb-4"
                accessibilityLabel="edit-profile-title"
            >
                Editar perfil
            </Text>

            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <InputField
                        label="Nombre"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Tu nombre"
                        error={errors.name?.message}
                        accessibilityLabel="input-name"
                    />
                )}
            />

            <Controller
                control={control}
                name="surname"
                render={({ field: { onChange, value } }) => (
                    <InputField
                        label="Apellidos"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Tus apellidos"
                        error={errors.surname?.message}
                        accessibilityLabel="input-surname"
                    />
                )}
            />

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                    <InputField
                        label="Email"
                        value={value}
                        onChangeText={onChange}
                        placeholder="correo@ejemplo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email?.message}
                        accessibilityLabel="input-email"
                    />
                )}
            />

            <View className="mt-6">
                <PrimaryButton
                    title={loading ? 'Guardando...' : 'Guardar cambios'}
                    onPress={handleSubmit(update)}
                    disabled={loading}
                    accessibilityLabel="save-profile-button"
                />
            </View>
        </View>
    );
};

export default EditProfileScreen;
