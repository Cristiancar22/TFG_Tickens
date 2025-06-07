import { Stack } from 'expo-router';

export default function StatsStackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="storePricesCompare" options={{ title: 'Comparador de precios por tiendas' }} />
            <Stack.Screen name="storePricesCompare/[id]" options={{ title: 'Cargando...' }} />
        </Stack>
    );
}
