import { useEffect } from 'react';
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTransactionStore } from '@/store/useTransaction';
import { useRouter } from 'expo-router';

export const TransactionDetailsScreen = () => {
	const { transactions, isLoading, fetchTransactions } = useTransactionStore();
	const router = useRouter();

	useEffect(() => {
		fetchTransactions();
	}, []);

	return (
		<View className="flex-1 p-4 bg-white">
			{isLoading ? (
				<ActivityIndicator size="large" />
			) : (
				<FlatList
					data={transactions}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => (
						<TouchableOpacity
							className="mb-4 p-4 rounded-lg bg-gray-100"
							onPress={() => router.push({
								pathname: "/transactions/[id]",
								params: { id: item._id },
							})}
						>
							<Text className="text-lg font-bold">{item.tienda.name}</Text>
							<Text>Total: {item.total} €</Text>
							<Text>Fecha: {new Date(item.purchaseDate).toLocaleDateString()}</Text>
						</TouchableOpacity>
					)}
				/>
			)}
		</View>
	);
};

export default TransactionDetailsScreen;
