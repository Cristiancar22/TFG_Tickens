import { View, ScrollView, Text } from 'react-native';
import { useState } from 'react';
import { PeriodNavigator, StatsChart, ViewTypeSelector } from '@/components/stats';

const StatsScreen = () => {
    const [viewType, setViewType] = useState<'monthly' | 'annual'>('monthly');
    const [currentDate, setCurrentDate] = useState(new Date());

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
        </ScrollView>
    );
};

export default StatsScreen;
