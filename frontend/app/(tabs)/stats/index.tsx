import { TouchableOpacity, ScrollView, Text } from 'react-native';
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

            <TouchableOpacity
                onPress={() => router.push('/stats/storePricesCompare')}
                className="bg-primary flex-row items-center justify-between p-4 rounded-xl mb-4"
            >
                <Text className="text-white text-lg font-semibold">
                    Comparar precios entre tiendas
                </Text>
                <Ionicons name="storefront-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('/stats/customReport')}
                className="bg-secondary flex-row items-center justify-between p-4 rounded-xl mb-4"
            >
                <Text className="text-white text-lg font-semibold">
                    Crear informe personalizado
                </Text>
                <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="white"
                />
            </TouchableOpacity>
        </ScrollView>
    );
};

export default StatsScreen;
