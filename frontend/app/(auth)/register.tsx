import { View, Text, Alert } from 'react-native';
import { useAuth } from '../../store/useAuth';
import { useForm } from 'react-hook-form';
import { registerSchema, RegisterSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '@/services';
import { useRouter } from 'expo-router';
import { InputField } from '@/components/ui/InputField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function Register() {
    const login = useAuth((s) => s.login);
    const setUser = useAuth((s) => s.setUser);
    const router = useRouter();

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterSchema) => {
        try {
            const { token, ...user } = await registerUser(data);

            setUser(user);
            login(token);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View
            className="flex-1 justify-center px-4 bg-background"
            accessibilityLabel="register-screen"
        >
            <View
                className="bg-white p-6 rounded-2xl shadow-md"
                accessibilityLabel="register-form"
            >
                <InputField
                    label="Nombre"
                    placeholder="Nombre"
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={(text) => setValue('name', text, { shouldValidate: true })}
                    error={errors.name?.message}
                    accessibilityLabel="input-name"
                />

                <InputField
                    label="Apellidos"
                    placeholder="Apellidos"
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={(text) => setValue('surname', text, { shouldValidate: true })}
                    error={errors.surname?.message}
                    accessibilityLabel="input-surname"
                />

                <InputField
                    label="Email"
                    placeholder="email@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => setValue('email', text, { shouldValidate: true })}
                    error={errors.email?.message}
                    accessibilityLabel="input-email"
                />

                <InputField
                    label="Contraseña"
                    placeholder="••••••••"
                    secure
                    onChangeText={(text) => setValue('password', text, { shouldValidate: true })}
                    error={errors.password?.message}
                    accessibilityLabel="input-password"
                />

                <PrimaryButton
                    title="Registrarse"
                    onPress={handleSubmit(onSubmit)}
                    accessibilityLabel="register-button"
                />

                <Text
                    className="text-center my-4 text-primary underline"
                    onPress={() => router.push('/login')}
                    accessibilityLabel="navigate-login"
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </Text>
            </View>
        </View>
    );
}
