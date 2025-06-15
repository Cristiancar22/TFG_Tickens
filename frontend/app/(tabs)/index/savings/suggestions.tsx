import { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { getSavingsRecommendations } from '@/services/savings.service';

export default function SavingsSuggestionsScreen() {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getSavingsRecommendations();
            setSuggestions(data);
        } catch (err: any) {
            Alert.alert(
                'Error',
                err.message || 'No se pudieron cargar las sugerencias',
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const SuggestionCard = ({ text }: { text: string }) => (
        <View
            style={{
                backgroundColor: '#fff',
                padding: 16,
                marginHorizontal: 16,
                marginVertical: 8,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 2,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Ionicons
                name="bulb-outline"
                size={24}
                color={colors.accent}
                style={{ marginRight: 12 }}
            />
            <Text style={{ flex: 1, color: colors.text, fontSize: 15 }}>
                {text}
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white pt-4">
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <FlatList
                    data={suggestions}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={({ item }) => <SuggestionCard text={item} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                        />
                    }
                    contentContainerStyle={
                        suggestions.length === 0
                            ? { flex: 1, justifyContent: 'center' }
                            : {}
                    }
                    ListEmptyComponent={() => (
                        <Text className="text-center text-neutral-500">
                            No hay sugerencias de momento.
                        </Text>
                    )}
                />
            )}
        </View>
    );
}
