import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { colors } from '@/constants/colors';
import { CustomSelect } from '@/components/ui/CustomSelect';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Store } from '@/types';
import { formatDate } from '@/utils';

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

    const isValidDate = (d: Date) => !isNaN(d.getTime());

    const parsedDate = new Date(purchaseDate ?? '');
    const dateToShow = isValidDate(parsedDate) ? parsedDate : new Date();

    if (editMode) {
        return (
            <View
                style={styles.headerContainer}
                accessibilityLabel="transaction-header-edit"
            >
                <CustomSelect
                    label="Tienda"
                    items={stores}
                    selectedId={storeId}
                    getById={getStoreById}
                    onChange={onStoreChange}
                />

                <Text style={styles.label} accessibilityLabel="label-date">
                    Fecha de compra
                </Text>

                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.inputField}
                    accessibilityLabel="date-picker-toggle"
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 16,
                        }}
                        accessibilityLabel="selected-date"
                    >
                        {formatDate(dateToShow.toISOString())}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dateToShow}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(_, date) => {
                            if (date) {
                                onDateChange(date.toISOString());
                            }
                            setShowDatePicker(false);
                        }}
                    />
                )}
            </View>
        );
    }

    return (
        <View
            style={styles.headerContainer}
            accessibilityLabel="transaction-header-view"
        >
            <Text style={styles.label} accessibilityLabel="label-store">
                Tienda
            </Text>
            <Text style={styles.value} accessibilityLabel="store-name">
                {store?.name ?? 'Tienda desconocida'}
            </Text>

            <Text style={styles.label} accessibilityLabel="label-total">
                Total
            </Text>
            <Text style={styles.value} accessibilityLabel="total-amount">
                {total.toFixed(2)} €
            </Text>

            <Text style={styles.label} accessibilityLabel="label-date">
                Fecha de compra
            </Text>
            <Text style={styles.value} accessibilityLabel="purchase-date">
                {formatDate(new Date(purchaseDate).toISOString())}
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
        marginBottom: 4,
    },
    value: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.secondary,
        marginBottom: 10,
    },
    inputField: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
});
