import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export const HomeScreen = () => {
    const router = useRouter();
    
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-xl">Pantalla Principal</Text>
            <Pressable
                className="mt-4 p-2 bg-green-500 rounded"
                onPress={() => router.push('/(tabs)/manageProducts')}
            >
                <Text className="text-white">Modificar Productos</Text>
            </Pressable>
            <Pressable
                className="mt-4 p-2 bg-red-500 rounded"
                onPress={() => router.push('/(tabs)/manageStores')}
            >
                <Text className="text-white">Modificar Tiendas</Text>
            </Pressable>

        </View>
    );
};

export default HomeScreen;
