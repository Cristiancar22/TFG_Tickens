import { useStores } from '@/store/useStore';
import { Transaction } from '@/types';
import { formatDate } from '@/utils';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type Props = {
    item: Transaction;
};

export const TransactionItem = ({ item }: Props) => {
    const router = useRouter();
    const { getStoreById } = useStores();
    const store = getStoreById(item.store);

    return (
        <TouchableOpacity
            accessibilityLabel={`transaction-${item._id}`}
            onPress={() =>
                router.push({
                    pathname: '/transactions/[id]',
                    params: { id: item._id },
                })
            }
            style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                marginHorizontal: 16,
                marginVertical: 8,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                elevation: 4,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <View
                    style={{
                        borderRadius: 20,
                        padding: 8,
                        marginRight: 12,
                    }}
                    accessibilityLabel={`transaction-store-icon-${item._id}`}
                >
                    <Ionicons
                        name="storefront-outline"
                        size={24}
                        color={colors.primary}
                    />
                </View>
                <Text
                    accessibilityLabel={`transaction-store-name-${item._id}`}
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.text,
                        flexShrink: 1,
                    }}
                >
                    {store?.name || 'Tienda sin asignar'}
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 8,
                }}
            >
                <Text
                    accessibilityLabel={`transaction-total-${item._id}`}
                    style={{ color: colors.foreground, fontSize: 14 }}
                >
                    Total: {item.total.toFixed(2)} €
                </Text>
                <Text
                    accessibilityLabel={`transaction-date-${item._id}`}
                    style={{ color: colors.foreground, fontSize: 14 }}
                >
                    {formatDate(new Date(item.purchaseDate).toISOString())}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
