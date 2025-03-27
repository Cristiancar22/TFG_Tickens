import { View, Text, Button, Alert, TextInput } from 'react-native';
import { useAuth } from '../../store/useAuth';
import { useForm } from 'react-hook-form';
import { registerSchema, RegisterSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '@/services';
import { useRouter } from 'expo-router';

export default function Register() {
	const login = useAuth((s) => s.login);
	const router = useRouter();

	const {
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
	})

	const onSubmit = async (data: RegisterSchema) => {
		try {
			const response = await registerUser(data)
			login(response.token)
		} catch (err: any) {
			Alert.alert('Error', err.message)
		}
	}

	return (
		<View className="flex-1 justify-center px-4">
			<Text>Nombre</Text>
			<TextInput
				className="border px-2 py-1 my-1 rounded"
				onChangeText={(text) => setValue('name', text)}
				autoCapitalize="none"
				keyboardType="default"
			/>
			{ errors.name && <Text className="text-red-500">{errors.name.message}</Text>}

			<Text>Apellidos</Text>
			<TextInput
				className="border px-2 py-1 my-1 rounded"
				onChangeText={(text) => setValue('surname', text)}
				autoCapitalize="none"
				keyboardType="default"
			/>
			{ errors.surname && <Text className="text-red-500">{errors.surname.message}</Text>}

			<Text>Email</Text>
			<TextInput
				className="border px-2 py-1 my-1 rounded"
				onChangeText={(text) => setValue('email', text)}
				autoCapitalize="none"
				keyboardType="email-address"
			/>
			{ errors.email && <Text className="text-red-500">{errors.email.message}</Text>}

			<Text>Contraseña</Text>
			<TextInput
				className="border px-2 py-1 my-1 rounded"
				secureTextEntry
				onChangeText={(text) => setValue('password', text)}
			/>
			{ errors.password && <Text className="text-red-500">{errors.password.message}</Text>}

			<Button title="Registrarse" onPress={handleSubmit(onSubmit)} />
			<Text className="text-center my-2" onPress={ () => router.push('/login') }>¿Ya tienes cuenta? Inicia sesión</Text>
		</View>
	);
}
