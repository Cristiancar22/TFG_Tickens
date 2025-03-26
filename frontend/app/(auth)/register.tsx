import { View, Text, Button } from 'react-native';
import { useAuth } from '../../store/useAuth';

export default function Register() {
	const login = useAuth((s) => s.login);

	return (
		<View className="flex-1 items-center justify-center">
			<Text className="text-xl">Pantalla de Registro</Text>
			<Button title="Iniciar sesión" onPress={login} />
		</View>
	);
}
