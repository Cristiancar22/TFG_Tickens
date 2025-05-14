import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '@/store/useTransaction';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionFilter } from '@/components/transactions/TransactionFilter';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const TransactionDetailsScreen = () => {
    const router = useRouter();
    const { transactions, isLoading, fetchTransactions } =
        useTransactionStore();

    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        sortOrderAsc: true,
        minDate: null as Date | null,
        maxDate: null as Date | null,
        minPrice: null as number | null,
        maxPrice: null as number | null,
    });

    const [pendingFilters, setPendingFilters] = useState({ ...filters });

    const toggleFilters = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowFilters(!showFilters);
    };

    const applyFilters = () => {
        setFilters({ ...pendingFilters });
    };

    const resetFilters = () => {
        const reset = {
            sortOrderAsc: true,
            minDate: null,
            maxDate: null,
            minPrice: null,
            maxPrice: null,
        };
        setFilters(reset);
        setPendingFilters(reset);
    };

    const prices = transactions.map((t) => t.total ?? 0);
    const absoluteMinPrice = Math.min(...prices);
    const absoluteMaxPrice = Math.max(...prices);

    const filteredTransactions = transactions
        .filter((t) => {
            const purchaseDate = new Date(t.purchaseDate);
            const inDateRange =
                (!filters.minDate || purchaseDate >= filters.minDate) &&
                (!filters.maxDate || purchaseDate <= filters.maxDate);
            const inPriceRange =
                (!filters.minPrice || (t.total ?? 0) >= filters.minPrice) &&
                (!filters.maxPrice || (t.total ?? 0) <= filters.maxPrice);
            return inDateRange && inPriceRange;
        })
        .sort((a, b) => {
            const dateA = new Date(a.purchaseDate).getTime();
            const dateB = new Date(b.purchaseDate).getTime();
            return filters.sortOrderAsc ? dateA - dateB : dateB - dateA;
        });

    return (
        <View className="flex-1 bg-white">
            <View className="border-b border-gray-300 shadow-lg bg-white">
                <View className="p-4 flex-row justify-between items-center">
                    <Text className="text-2xl font-bold mb-2">
                        Listado de Transacciones
                    </Text>
                    <TouchableOpacity
                        onPress={toggleFilters}
                        style={styles.filterButton}
                    >
                        <Ionicons
                            name={
                                showFilters
                                    ? 'close-outline'
                                    : 'options-outline'
                            }
                            size={25}
                            color={colors.background}
                        />
                    </TouchableOpacity>
                </View>

                {showFilters && (
                    <TransactionFilter
                        sortOrderAsc={pendingFilters.sortOrderAsc}
                        setSortOrderAsc={(v) =>
                            setPendingFilters((p) => ({
                                ...p,
                                sortOrderAsc: v,
                            }))
                        }
                        minDate={pendingFilters.minDate}
                        maxDate={pendingFilters.maxDate}
                        setMinDate={(d) =>
                            setPendingFilters((p) => ({ ...p, minDate: d }))
                        }
                        setMaxDate={(d) =>
                            setPendingFilters((p) => ({ ...p, maxDate: d }))
                        }
                        minPrice={pendingFilters.minPrice}
                        maxPrice={pendingFilters.maxPrice}
                        setMinPrice={(v) =>
                            setPendingFilters((p) => ({ ...p, minPrice: v }))
                        }
                        setMaxPrice={(v) =>
                            setPendingFilters((p) => ({ ...p, maxPrice: v }))
                        }
                        onReset={resetFilters}
                        onApply={applyFilters}
                        absoluteMinPrice={absoluteMinPrice}
                        absoluteMaxPrice={absoluteMaxPrice}
                    />
                )}
            </View>

            <TransactionList
                transactions={filteredTransactions}
                isLoading={isLoading}
                onRefresh={fetchTransactions}
            />
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() =>
                    router.push({
                        pathname: '/transactions/newTransaction',
                    })
                }
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default TransactionDetailsScreen;

const styles = StyleSheet.create({
    filterButton: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 8,
        elevation: 5,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 8,
        elevation: 5,
    },
});
