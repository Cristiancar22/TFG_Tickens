import { Text, TouchableOpacity } from 'react-native';

type Props = {
    title: string;
    onPress: () => void;
};

export const PrimaryButton = ({ title, onPress }: Props) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-primary px-4 py-2 rounded-xl"
        activeOpacity={ 0.8 }
    >
        <Text className="text-white text-center font-semibold">{title}</Text>
    </TouchableOpacity>
);