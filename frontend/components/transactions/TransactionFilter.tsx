import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { colors } from '@/constants/colors';
import { DateRangeSelector } from '../ui/DateRangeSelector';

type Props = {
    sortOrderAsc: boolean;
    setSortOrderAsc: (value: boolean) => void;
    minDate: Date | null;
    maxDate: Date | null;
    setMinDate: (date: Date | null) => void;
    setMaxDate: (date: Date | null) => void;
    minPrice: number | null;
    maxPrice: number | null;
    setMinPrice: (price: number | null) => void;
    setMaxPrice: (price: number | null) => void;
    onReset: () => void;
    onApply: () => void;
    absoluteMinPrice: number;
    absoluteMaxPrice: number;
};

export const TransactionFilter = ({
    sortOrderAsc,
    setSortOrderAsc,
    minDate,
    maxDate,
    setMinDate,
    setMaxDate,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    onReset,
    onApply,
    absoluteMinPrice,
    absoluteMaxPrice,
}: Props) => {
    return (
        <View
            className="p-4 rounded-b-xl"
            accessibilityLabel="transaction-filter"
        >
            {/* Ordenar por fecha */}
            <View className="justify-between mb-4">
                <Text
                    className="font-bold mb-2"
                    accessibilityLabel="label-sort-order"
                >
                    Ordenar por fecha:
                </Text>
                <View className="flex-row items-center justify-around">
                    <TouchableOpacity
                        style={
                            !sortOrderAsc
                                ? styles.activeButton
                                : styles.inactiveButton
                        }
                        onPress={() => setSortOrderAsc(false)}
                        accessibilityLabel="sort-desc-button"
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                !sortOrderAsc && styles.activeButtonText,
                            ]}
                        >
                            Descendente
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={
                            sortOrderAsc
                                ? styles.activeButton
                                : styles.inactiveButton
                        }
                        onPress={() => setSortOrderAsc(true)}
                        accessibilityLabel="sort-asc-button"
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                sortOrderAsc && styles.activeButtonText,
                            ]}
                        >
                            Ascendente
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Rango de fechas */}
            <Text
                className="font-bold mb-2"
                accessibilityLabel="label-date-range"
            >
                Filtrar por rango de fechas:
            </Text>
            <DateRangeSelector
                minDate={minDate}
                maxDate={maxDate}
                setMinDate={setMinDate}
                setMaxDate={setMaxDate}
            />

            {/* Rango de precios */}
            <Text
                className="font-bold mt-4 mb-2"
                accessibilityLabel="label-price-range"
            >
                Filtrar por rango de importe (€):
            </Text>
            <View
                className="mb-2 items-center"
                accessibilityLabel="price-slider-section"
            >
                <Text accessibilityLabel="price-range-values">
                    De {minPrice?.toFixed(2) ?? absoluteMinPrice.toFixed(2)}€ a{' '}
                    {maxPrice?.toFixed(2) ?? absoluteMaxPrice.toFixed(2)}€
                </Text>
                <View accessibilityLabel="price-slider">
                    <MultiSlider
                        values={[
                            minPrice ?? absoluteMinPrice,
                            maxPrice ?? absoluteMaxPrice,
                        ]}
                        min={absoluteMinPrice}
                        max={absoluteMaxPrice}
                        step={0.5}
                        allowOverlap={false}
                        snapped
                        onValuesChange={(values) => {
                            setMinPrice(values[0]);
                            setMaxPrice(values[1]);
                        }}
                        selectedStyle={{
                            backgroundColor: colors.primary,
                            width: '100%',
                        }}
                    />
                </View>
            </View>

            {/* Botones */}
            <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                    style={styles.activeButton}
                    onPress={onReset}
                    accessibilityLabel="reset-button"
                >
                    <Text style={[styles.buttonText, styles.activeButtonText]}>
                        Borrar filtros
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.activeButton}
                    onPress={onApply}
                    accessibilityLabel="apply-button"
                >
                    <Text style={[styles.buttonText, styles.activeButtonText]}>
                        Aplicar filtros
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    activeButton: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 8,
        elevation: 5,
    },
    inactiveButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15,
        padding: 8,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    activeButtonText: {
        color: 'white',
    },
});
