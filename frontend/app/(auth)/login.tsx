import { View, Text, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../../schemas/auth.schema';
import { loginUser } from '../../services/auth.service';
import { useAuth } from '../../store/useAuth';
import { useRouter } from 'expo-router';
import { InputField } from '@/components/ui/InputField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function Login() {
    const login = useAuth((s) => s.login);
    const setUser = useAuth((s) => s.setUser);
    const router = useRouter();

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        try {
            const { token, ...user } = await loginUser(data);

            setUser(user);
            login(token);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View
            className="flex-1 justify-center px-4 bg-background"
            accessibilityLabel="login-screen"
        >
            <View
                className="bg-white p-6 rounded-2xl shadow-md"
                accessibilityLabel="login-form"
            >
                <InputField
                    label="Email"
                    placeholder="email@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => setValue('email', text)}
                    error={errors.email?.message}
                    accessibilityLabel="input-email"
                />

                <InputField
                    label="Contraseña"
                    placeholder="••••••••"
                    secure
                    autoCapitalize="none"
                    onChangeText={(text) => setValue('password', text)}
                    error={errors.password?.message}
                    accessibilityLabel="input-password"
                />

                <PrimaryButton
                    title="Iniciar sesión"
                    onPress={handleSubmit(onSubmit)}
                    accessibilityLabel="login-button"
                />

                {/* <PrimaryButton
                    title="Login rápido (Juan)"
                    onPress={() =>
                        onSubmit({
                            email: 'juan.perez@example.com',
                            password: 'MiPassword123',
                        })
                    }
                    accessibilityLabel="login-quick-button"
                /> */}

                <Text
                    className="text-center my-4 text-primary underline"
                    onPress={() => router.push('/register')}
                    accessibilityLabel="navigate-register"
                >
                    ¿No tienes cuenta? Regístrate
                </Text>
            </View>
        </View>
    );
}
