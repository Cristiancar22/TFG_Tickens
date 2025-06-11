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
                name="manageBudgets"
                options={{
                    title: 'Gestionar Presupuestos',
                }}
            />

            <Stack.Screen
                name="savings/index"
                options={{
                    title: 'Gestión de Ahorro',
                }}
            />

            <Stack.Screen
                name="savings/editGoal"
                options={{
                    title: 'Modificar Meta de Ahorro',
                }}
            />

            <Stack.Screen
                name="savings/history"
                options={{
                    title: 'Historial de ahorro',
                }}
            />

            <Stack.Screen
                name="savings/suggestions"
                options={{
                    title: 'Sugerencias de Ahorro',
                }}
            />

            <Stack.Screen
                name="savings/historyGoals"
                options={{
                    title: 'Historial de metas de ahorro',
                }}
            />
        </Stack>
    );
}
