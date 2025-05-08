import { Transaction } from '@/types';
import { SectionList, ActivityIndicator, Text, View } from 'react-native';
import { TransactionItem } from './TransactionItem';

type Props = {
    transactions: Transaction[];
    isLoading: boolean;
    onRefresh: () => void;
};

type Section = {
    title: string; // fecha
    data: Transaction[];
};

export const TransactionList = ({
    transactions,
    isLoading,
    onRefresh,
}: Props) => {
    // Agrupar transacciones por fecha
    const groupedTransactions: Section[] = transactions.reduce(
        (groups, transaction) => {
            const date = new Date(
                transaction.purchaseDate,
            ).toLocaleDateString();
            const group = groups.find((g) => g.title === date);
            if (group) {
                group.data.push(transaction);
            } else {
                groups.push({ title: date, data: [transaction] });
            }
            return groups;
        },
        [] as Section[],
    );

    return (
        <SectionList
            sections={groupedTransactions}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <TransactionItem item={item} />}
            renderSectionHeader={({ section: { title } }) => (
                <View className="bg-gray-200 px-4 py-2">
                    <Text className="text-gray-700 font-bold">{title}</Text>
                </View>
            )}
            onRefresh={onRefresh}
            refreshing={isLoading}
            ListEmptyComponent={
                isLoading ? (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <View className="flex-1 justify-center items-center py-10">
                        <Text className="text-gray-500">
                            No hay transacciones disponibles
                        </Text>
                    </View>
                )
            }
            contentContainerStyle={{ flexGrow: 1 }}
        />
    );
};
