import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import {
    VictoryBar,
    VictoryChart,
    VictoryTheme,
    VictoryAxis,
} from 'victory-native';
import { getStatsData, getStatsPrediction } from '@/services/stats.service';
import { colors as appColors } from '@/constants/colors';

interface Props {
    viewType: 'monthly' | 'annual';
    currentDate: Date;
}

interface ChartDatum {
    x: string;
    y: number;
    color: string;
}

export const StatsChart = ({ viewType, currentDate }: Props) => {
    const [data, setData] = useState<ChartDatum[]>([]);
    const [loading, setLoading] = useState(false);
    const [isPrediction, setIsPrediction] = useState(false);

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;

                const today = new Date();
                const futureMonth =
                    viewType === 'monthly' &&
                    (year > today.getFullYear() ||
                        (year === today.getFullYear() &&
                            month > today.getMonth() + 1));

                let raw;

                if (futureMonth) {
                    raw = await getStatsPrediction({ year, month });
                    setIsPrediction(true);
                } else {
                    raw = await getStatsData({
                        viewType,
                        year,
                        ...(viewType === 'monthly' ? { month } : {}),
                    });
                    setIsPrediction(false);
                }

                const parsed: ChartDatum[] = raw
                    .map((item: any) => ({
                        x: item.label,
                        y: Number(item.value) || 0,
                        color: item.color || appColors.primary
                    }))
                    .sort((a, b) => b.y - a.y)
                    .slice(0, 6);

                setData(parsed);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
                setData([]);
            }
            setLoading(false);
        };
        fetchChartData();
    }, [viewType, currentDate]);

    if (loading) {
        return (
            <View className="h-[220px] justify-center items-center">
                <ActivityIndicator size="large" color={appColors.primary} />
                <Text className="mt-2 text-gray-500">Cargando datos...</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View className="h-[220px] justify-center items-center">
                <Text className="text-gray-500 text-base">
                    ¡No hay registros!
                </Text>
            </View>
        );
    }

    return (
        <View
            style={{
                paddingHorizontal: 16,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {/* Disclaimer sobre el tipo de datos */}
            <Text
                style={{
                    alignSelf: 'flex-start',
                    marginBottom: 1,
                    color: isPrediction
                        ? appColors.accent
                        : appColors.secondary,
                    fontStyle: 'italic',
                    fontSize: 15,
                }}
            >
                {isPrediction ? 'Predicción de gasto' : ''}
            </Text>

            <VictoryChart
                width={Dimensions.get('window').width - 32}
                height={240}
                theme={VictoryTheme.material}
                domainPadding={20}
            >
                <VictoryAxis
                    style={{
                        tickLabels: {
                            fontSize: 10,
                            angle:
                                data.length < 4 ? 0 : data.length < 6 ? 10 : 15,
                            padding: 8,
                        },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `${t}€`}
                    style={{
                        tickLabels: { fontSize: 10 },
                    }}
                />
                <VictoryBar
                    data={data}
                    style={{
                        data: {
                            fill: ({ datum }) => datum.color,
                            borderRadius: 4,
                        },
                    }}
                    barRatio={0.7}
                    labels={({ datum }) => `${datum.y.toFixed(2)}€`}
                    animate={{ duration: 500, onLoad: { duration: 200 } }}
                />
            </VictoryChart>
        </View>
    );
};
