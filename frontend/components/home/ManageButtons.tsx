import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const ManageButtons = () => {
    const router = useRouter();

    const buttons = [
        {
            label: 'Gestionar Productos',
            route: '/(tabs)/manageProducts',
            color: 'bg-primary',
            icon: 'cube-outline',
        },
        {
            label: 'Gestionar Tiendas',
            route: '/(tabs)/manageStores',
            color: 'bg-secondary',
            icon: 'storefront-outline',
        },
        {
            label: 'Gestionar Presupuestos',
            route: '/(tabs)/manageBudgets',
            color: 'bg-accent',
            icon: 'wallet-outline',
        },
        {
            label: 'Gestionar Ahorro',
            route: '/(tabs)/manageSavings',
            color: 'bg-danger',
            icon: 'stats-chart-outline',
        },
    ];

    return (
        <>
            {buttons.map((btn) => (
                <TouchableOpacity
                    key={btn.route}
                    onPress={() => router.push(btn.route)}
                    className={`${btn.color} flex-row items-center justify-between p-4 rounded-xl mb-4`}
                >
                    <Text className="text-white text-lg font-semibold">
                        {btn.label}
                    </Text>
                    <Ionicons name={btn.icon as any} size={24} color="white" />
                </TouchableOpacity>
            ))}
        </>
    );
};
