import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { CustomSelect } from '@/components/ui/CustomSelect';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Store } from '@/types';

type Props = {
    editMode: boolean;
    storeId: string | null;
    stores: Store[];
    getStoreById: (id: string) => Store | undefined;
    purchaseDate: string;
    onStoreChange: (id: string) => void;
    onDateChange: (date: string) => void;
    showDatePicker: boolean;
    setShowDatePicker: (value: boolean) => void;
    total: number;
};

export const TransactionHeader = ({
    editMode,
    storeId,
    stores,
    getStoreById,
    purchaseDate,
    onStoreChange,
    onDateChange,
    showDatePicker,
    setShowDatePicker,
    total,
}: Props) => {
    const store = storeId ? getStoreById(storeId) : null;

    if (editMode) {
        return (
            <View style={styles.headerContainer}>
                <CustomSelect
                    label="Tienda"
                    items={stores}
                    selectedId={storeId}
                    getById={getStoreById}
                    onChange={onStoreChange}
                />

                <Text style={styles.label}>Fecha de compra</Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateButton}
                >
                    <Text>{new Date(purchaseDate).toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date(purchaseDate)}
                        mode="date"
                        display="default"
                        onChange={(_, date) => {
                            if (date) {
                                onDateChange(date.toISOString());
                                setShowDatePicker(false);
                            }
                        }}
                    />
                )}
            </View>
        );
    }

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.label}>Tienda</Text>
            <Text style={styles.value}>
                {store?.name ?? 'Tienda desconocida'}
            </Text>

            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>{total.toFixed(2)} €</Text>

            <Text style={styles.label}>Fecha de compra</Text>
            <Text style={styles.value}>
                {new Date(purchaseDate).toLocaleDateString()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    label: {
        fontSize: 13,
        color: colors.foreground,
        marginBottom: 2,
    },
    value: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.secondary,
        marginBottom: 10,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
});
