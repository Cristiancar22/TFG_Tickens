import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors'; // Ajusta esta ruta según tu proyecto

interface Props {
    viewType: 'monthly' | 'annual';
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
}

const formatLabel = (viewType: 'monthly' | 'annual', date: Date) => {
    if (viewType === 'monthly') {
        return date.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
        });
    }
    return date.getFullYear().toString();
};

export const PeriodNavigator = ({ viewType, currentDate, setCurrentDate }: Props) => {
    const updateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (viewType === 'monthly') {
            newDate.setMonth(
                currentDate.getMonth() + (direction === 'next' ? 1 : -1),
            );
        } else {
            newDate.setFullYear(
                currentDate.getFullYear() + (direction === 'next' ? 1 : -1),
            );
        }
        setCurrentDate(newDate);
    };

    return (
        <View className="flex-row justify-center items-center mb-4">
            <TouchableOpacity
                onPress={() => updateDate('prev')}
                style={{
                    backgroundColor: colors.primary,
                    borderRadius: 20,
                    padding: 8,
                }}
            >
                <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>

            <Text
                style={{
                    marginHorizontal: 16,
                    fontWeight: '600',
                    fontSize: 16,
                    color: colors.text,
                }}
            >
                {formatLabel(viewType, currentDate)}
            </Text>

            <TouchableOpacity
                onPress={() => updateDate('next')}
                style={{
                    backgroundColor: colors.primary,
                    borderRadius: 20,
                    padding: 8,
                }}
            >
                <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

