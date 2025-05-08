import { Transaction } from '@/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
    item: Transaction;
};

export const TransactionItem = ({ item }: Props) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            className="mb-4 p-4 rounded-lg bg-gray-100"
            onPress={() =>
                router.push({
                    pathname: '/transactions/[id]',
                    params: { id: item._id },
                })
            }
        >
            <Text className="text-lg font-bold">{item.store?.name}</Text>
            <Text>Total: {item.total.toFixed(2)} €</Text>
            <Text>
                Fecha: {new Date(item.purchaseDate).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );
};
