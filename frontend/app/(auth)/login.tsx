import { View, Text, TextInput, Button, Alert } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginSchema } from '../../schemas/auth.schema'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../store/useAuth'

export default function Login() {
	const login = useAuth((s) => s.login)

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<LoginSchema>({
	resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (data: LoginSchema) => {
		try {
			const response = await loginUser(data)
			login(response.token)
		} catch (err: any) {
			Alert.alert('Error', err.message)
		}
	}

	return (
	<View className="flex-1 justify-center px-4">
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

		<Button title="Iniciar sesión" onPress={handleSubmit(onSubmit)} />
	</View>
	)
}