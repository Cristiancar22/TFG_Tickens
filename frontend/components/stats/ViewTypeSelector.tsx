import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface Props {
    viewType: 'monthly' | 'annual';
    setViewType: (value: 'monthly' | 'annual') => void;
}

export const ViewTypeSelector = ({ viewType, setViewType }: Props) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 16,
            }}
            accessibilityLabel="view-type-selector"
        >
            {['monthly', 'annual'].map((type) => {
                const isActive = viewType === type;
                return (
                    <TouchableOpacity
                        key={type}
                        onPress={() =>
                            setViewType(type as 'monthly' | 'annual')
                        }
                        style={{
                            backgroundColor: isActive
                                ? colors.primary
                                : colors.background,
                            borderColor: colors.primary,
                            borderWidth: 1,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 20,
                            marginHorizontal: 8,
                        }}
                        accessibilityLabel={`view-type-${type}-button`}
                    >
                        <Text
                            style={{
                                color: isActive ? '#fff' : colors.text,
                                fontWeight: isActive ? '600' : '400',
                            }}
                            accessibilityLabel={`view-type-${type}-label`}
                        >
                            {type === 'monthly' ? 'Mensual' : 'Anual'}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
