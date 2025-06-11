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
            a11y: 'manage-products-button',
        },
        {
            label: 'Gestionar Tiendas',
            route: '/(tabs)/manageStores',
            color: 'bg-secondary',
            icon: 'storefront-outline',
            a11y: 'manage-stores-button',
        },
        {
            label: 'Gestionar Presupuestos',
            route: '/(tabs)/manageBudgets',
            color: 'bg-accent',
            icon: 'wallet-outline',
            a11y: 'manage-budgets-button',
        },
        {
            label: 'Gestionar Ahorro',
            route: '/(tabs)/savings',
            color: 'bg-danger',
            icon: 'stats-chart-outline',
            a11y: 'manage-savings-button',
        },
    ];

    return (
        <>
            {buttons.map((btn) => (
                <TouchableOpacity
                    key={btn.route}
                    accessibilityLabel={btn.a11y}
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
