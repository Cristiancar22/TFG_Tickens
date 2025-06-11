import { Transaction } from '@/types';
import {
    SectionList,
    ActivityIndicator,
    Text,
    View,
} from 'react-native';
import { TransactionItem } from './TransactionItem';
import { formatDate } from '@/utils';
import { colors } from '@/constants/colors';

type Props = {
    transactions: Transaction[];
    isLoading: boolean;
    onRefresh: () => void;
};

type Section = {
    title: string;
    data: Transaction[];
};

export const TransactionList = ({
    transactions,
    isLoading,
    onRefresh,
}: Props) => {
    const groupedTransactions: Section[] = transactions.reduce(
        (groups, transaction) => {
            const date = formatDate(
                new Date(transaction.purchaseDate).toISOString()
            );

            const group = groups.find((g) => g.title === date);
            if (group) {
                group.data.push(transaction);
            } else {
                groups.push({ title: date, data: [transaction] });
            }
            return groups;
        },
        [] as Section[]
    );

    return (
        <SectionList
            sections={groupedTransactions}
            keyExtractor={(item) => item._id}
            accessibilityLabel="transaction-list"
            renderItem={({ item }) => (
                <TransactionItem item={item} />
            )}
            renderSectionHeader={({ section: { title } }) => (
                <Text
                    accessibilityLabel={`section-${title}`}
                    style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.primary,
                        marginVertical: 8,
                        marginLeft: 16,
                        textTransform: 'uppercase',
                    }}
                >
                    {title}
                </Text>
            )}
            onRefresh={onRefresh}
            refreshing={isLoading}
            ListEmptyComponent={
                isLoading ? (
                    <View
                        className="flex-1 justify-center items-center py-10"
                        accessibilityLabel="loading-spinner"
                    >
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <View
                        className="flex-1 justify-center items-center py-10"
                        accessibilityLabel="empty-transaction-list"
                    >
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
