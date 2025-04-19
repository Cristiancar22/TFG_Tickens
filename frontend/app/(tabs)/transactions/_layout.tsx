import { Stack } from 'expo-router';

export default function TransactionsStackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="[id]" />
        </Stack>
    );
}
