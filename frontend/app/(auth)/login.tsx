import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../../schemas/auth.schema';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../store/useAuth';
import { useRouter } from 'expo-router';
import { InputField } from '@/components/ui/InputField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function Login() {
	const login = useAuth((s) => s.login);
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
			const response = await loginUser(data);
			login(response.token);
		} catch (err: any) {
			Alert.alert('Error', err.message);
		}
	};

	return (
		<View className="flex-1 justify-center px-4 bg-background dark:bg-foreground">
			<InputField
				label="Email"
				placeholder="email@ejemplo.com"
				keyboardType="email-address"
				autoCapitalize="none"
				onChangeText={(text) => setValue('email', text)}
				error={errors.email?.message}
			/>

			<InputField
				label="Contraseña"
				placeholder="••••••••"
				secure
				onChangeText={(text) => setValue('password', text)}
				error={errors.password?.message}
			/>

			<PrimaryButton
				title="Iniciar sesión"
				onPress={handleSubmit(onSubmit)}
			/>

			<Text
				className="text-center my-4 text-primary underline"
				onPress={() => router.push('/register')}
			>
				¿No tienes cuenta? Regístrate
			</Text>
		</View>
	);
}
