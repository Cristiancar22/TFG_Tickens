import { Text, TouchableOpacity } from 'react-native';

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
};

export const PrimaryButton = ({ title, onPress, disabled = false }: Props) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-primary px-4 py-2 rounded-xl"
        activeOpacity={0.8}
        disabled={disabled}
    >
        <Text className="text-white text-center font-semibold">{title}</Text>
    </TouchableOpacity>
);
