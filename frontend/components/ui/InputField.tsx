import { TextInput, View, Text, TextInputProps, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type Props = {
    label?: string;
    error?: string;
    secure?: boolean;
} & TextInputProps;

export const InputField = ({
    label,
    error,
    secure = false,
    ...props
}: Props) => {
    const [isSecure, setIsSecure] = useState(secure);

    return (
        <View className="mb-4">
            {label && (
                <Text className="mb-1 text-foreground font-medium">
                    {label}
                </Text>
            )}

            <View className="relative">
                <TextInput
                    className={`
						border border-muted bg-white text-foreground 
						px-4 py-2 pr-10 rounded-xl
					`}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={isSecure}
                    {...props}
                />

                {secure && (
                    <Pressable
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onPress={() => setIsSecure((prev) => !prev)}
                    >
                        <Ionicons
                            name={isSecure ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#9CA3AF"
                        />
                    </Pressable>
                )}
            </View>

            {error && (
                <Text className="mt-1 text-sm text-red-500">{error}</Text>
            )}
        </View>
    );
};
