import { TransactionDetail } from '@/types';
import { Text, View } from 'react-native';

type Props = {
    detail: TransactionDetail;
    productName?: string;
};

export const TransactionDetailItem = ({ detail, productName }: Props) => {
    return (
        <View className="mt-2 border-b pb-2 border-gray-300">
            <Text>Producto: {productName}</Text>
            <Text>Cantidad: {detail.quantity}</Text>
            <Text>Precio unitario: {detail.unitPrice.toFixed(2)} €</Text>
            <Text>Subtotal: {detail.subtotal.toFixed(2)} €</Text>
        </View>
    );
};
