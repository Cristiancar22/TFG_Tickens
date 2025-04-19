import { InputField } from '@/components/ui/InputField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useUpdateProfile } from '@/hooks/profile/useUpdateProfile';
import {
    EditProfileSchema,
    editProfileSchema,
} from '@/schemas/editProfile.schema';
import { useAuth } from '@/store/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { View, Text } from 'react-native';

export const EditProfileScreen = () => {
    const user = useAuth((s) => s.user);

    const { update, loading } = useUpdateProfile();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditProfileSchema>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: user?.name || '',
            surname: user?.surname || '',
            email: user?.email || '',
        },
    });

    return (
        <View className="flex-1 p-6 bg-background">
            <Text className="text-xl font-semibold mb-4">Editar perfil</Text>

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
                    />
                )}
            />

            <View className="mt-6">
                <PrimaryButton
                    title={loading ? 'Guardando...' : 'Guardar cambios'}
                    onPress={handleSubmit(update)}
                    disabled={loading}
                />
            </View>
        </View>
    );
};

export default EditProfileScreen;
