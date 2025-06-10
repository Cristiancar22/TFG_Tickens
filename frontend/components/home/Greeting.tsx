import { Text } from 'react-native';
import { useAuth } from '@/store/useAuth';

export const Greeting = () => {
    const { user } = useAuth();

    return (
        <Text className="text-2xl font-bold text-primary mb-4">
            ¡Hola {user?.name}!
        </Text>
    );
};
