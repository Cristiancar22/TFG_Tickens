import { Pressable, ScrollView, Text } from 'react-native';
import { useState } from 'react';
import {
    PeriodNavigator,
    StatsChart,
    ViewTypeSelector,
} from '@/components/stats';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StatsScreen = () => {
    const [viewType, setViewType] = useState<'monthly' | 'annual'>('monthly');
    const [currentDate, setCurrentDate] = useState(new Date());

    const router = useRouter();

    return (
        <ScrollView className="flex-1 p-4 bg-white">
            <Text className="text-xl font-bold mb-4 text-center">
                Estadísticas de Gastos
            </Text>

            <ViewTypeSelector viewType={viewType} setViewType={setViewType} />
            <PeriodNavigator
                viewType={viewType}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />

            <StatsChart viewType={viewType} currentDate={currentDate} />

            <Pressable
                onPress={() => router.push('/stats/storePricesCompare')}
                className="bg-secondary flex-row items-center justify-between p-4 rounded-xl"
            >
                <Text className="text-white text-lg font-semibold">
                    Comparar precios entre tiendas
                </Text>
                <Ionicons name="storefront-outline" size={24} color="white" />
            </Pressable>
        </ScrollView>
    );
};

export default StatsScreen;
