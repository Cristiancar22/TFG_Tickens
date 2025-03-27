import { TextInput, View, Text, TextInputProps } from 'react-native';

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
	return (
		<View className="mb-4">
			{label && (
				<Text className="mb-1 text-foreground dark:text-background font-medium">
					{label}
				</Text>
			)}

			<TextInput
				className={`
                    border border-muted bg-white dark:bg-foreground text-foreground dark:text-white 
                    px-4 py-2 rounded-xl
                `}
				placeholderTextColor="#9CA3AF"
				secureTextEntry={secure}
				{...props}
			/>

			{error && (
				<Text className="mt-1 text-sm text-red-500">{error}</Text>
			)}
		</View>
	);
};
