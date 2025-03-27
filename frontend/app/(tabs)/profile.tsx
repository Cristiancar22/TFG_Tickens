import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/store/useAuth';
import { View, Text, Button } from 'react-native';

export default function Profile() {
	const logout = useAuth((s) => s.logout);

	return (
		<View className="flex-1 items-center justify-center">
			<Text className="text-xl">Pantalla Perfil</Text>
			<PrimaryButton title="Cerrar Sesion" onPress={ logout } />
		</View>
	);
}
