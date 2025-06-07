import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type Props = {
    minDate: Date | null;
    maxDate: Date | null;
    setMinDate: (date: Date | null) => void;
    setMaxDate: (date: Date | null) => void;
};

export const DateRangeSelector = ({
    minDate,
    maxDate,
    setMinDate,
    setMaxDate,
}: Props) => {
    const [pickerVisible, setPickerVisible] = useState(false);
    const [isSelectingMin, setIsSelectingMin] = useState(true);
    const [selectingBoth, setSelectingBoth] = useState(false); // nuevo estado

    const showPicker = (selectingMin: boolean, both = false) => {
        setIsSelectingMin(selectingMin);
        setPickerVisible(true);
        setSelectingBoth(both);
    };

    const handleConfirm = (date: Date) => {
        if (isSelectingMin) {
            setMinDate(date);
            if (selectingBoth) {
                // ir al siguiente paso: seleccionar fecha máxima
                setTimeout(() => {
                    setIsSelectingMin(false);
                    setPickerVisible(true);
                }, 300); // pequeño retraso para evitar cierre/reapertura inmediato
                return;
            }
        } else {
            setMaxDate(date);
        }
        setPickerVisible(false);
        setSelectingBoth(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => showPicker(true)}
                style={styles.dateBox}
            >
                <Text style={styles.primaryText}>
                    {minDate ? minDate.toLocaleDateString() : 'Desde'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.arrow}>→</Text>

            <TouchableOpacity
                onPress={() => showPicker(false)}
                style={styles.dateBox}
            >
                <Text style={styles.primaryText}>
                    {maxDate ? maxDate.toLocaleDateString() : 'Hasta'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => showPicker(true, true)} // activa selección doble
                style={styles.iconBox}
            >
                <Ionicons
                    name={'calendar-outline'}
                    size={20}
                    color={colors.primary}
                />
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={pickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => {
                    setPickerVisible(false);
                    setSelectingBoth(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        gap: 8,
        borderColor: colors.primary,
        borderWidth: 1,
    },
    dateBox: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        // backgroundColor: colors.background,
        color: colors.primary,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrow: {
        marginHorizontal: 4,
        color: '#ccc',
    },
    iconBox: {
        marginLeft: 'auto',
        padding: 3,
    },
    primaryText: {
        color: colors.primary,
    },
});
