import { Text, TouchableOpacity } from 'react-native';

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
};

export const PrimaryButton = ({ title, onPress, disabled = false, accessibilityLabel = '' }: Props) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-primary px-4 py-2 rounded-xl"
        activeOpacity={0.8}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
    >
        <Text className="text-white text-center font-semibold">{title}</Text>
    </TouchableOpacity>
);
