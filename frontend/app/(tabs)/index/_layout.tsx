import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="manageProducts"
                options={{
                    title: 'Modificando productos',
                }}
            />
            <Stack.Screen
                name="manageStores"
                options={{
                    title: 'Modificando Tiendas',
                }}
            />
            <Stack.Screen
                name="manageSavings"
                options={{
                    title: 'Gestión de Ahorro',
                }}
            />
            <Stack.Screen
                name="manageBudgets"
                options={{
                    title: 'Gestión de Presupuestos',
                }}
            />
        </Stack>
    );
}
