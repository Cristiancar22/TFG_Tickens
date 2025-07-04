import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: colors.background,
                tabBarInactiveTintColor: colors.secondary,
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                },
                tabBarIconStyle: {
                    marginTop: 0,
                    marginBottom: 0,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transacciones',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="swap-horizontal"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: 'Camara',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="camera" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Informes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="stats-chart-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
