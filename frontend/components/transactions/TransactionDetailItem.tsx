import { Product, TransactionDetail } from '@/types';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useCategories } from '@/store/useCategories';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    detail: TransactionDetail;
    product?: Product;
};

export const TransactionDetailItem = ({ detail, product }: Props) => {
    const getCategoryById = useCategories((state) => state.getCategoryById);

    const category = product?.category
        ? getCategoryById(product?.category)
        : undefined;

    const primaryColor = category?.primaryColor || '#F9F9F9';
    const secondaryColor = category?.secondaryColor || '#E0E0E0';
    const icon = category?.icon || null;

    console.log(product);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: primaryColor,
                    borderColor: secondaryColor,
                },
            ]}
        >
            <View style={styles.row}>
                <Text
                    style={[
                        styles.label,
                        {
                            color:
                                secondaryColor === '#E0E0E0'
                                    ? colors.foreground
                                    : secondaryColor,
                        },
                    ]}
                >
                    Producto
                </Text>
                {icon && (
                    <Ionicons name={icon} size={20} color={secondaryColor} />
                )}
            </View>

            <Text
                style={[
                    styles.value,
                    {
                        color:
                            secondaryColor === '#E0E0E0'
                                ? colors.foreground
                                : secondaryColor,
                    },
                ]}
            >
                {product?.name ?? 'Producto desconocido'}
            </Text>

            <View style={styles.row}>
                <View style={styles.column}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color:
                                    secondaryColor === '#E0E0E0'
                                        ? colors.foreground
                                        : secondaryColor,
                            },
                        ]}
                    >
                        Cantidad
                    </Text>
                    <Text
                        style={[
                            styles.value,
                            {
                                color:
                                    secondaryColor === '#E0E0E0'
                                        ? colors.foreground
                                        : secondaryColor,
                            },
                        ]}
                    >
                        {detail.quantity}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color:
                                    secondaryColor === '#E0E0E0'
                                        ? colors.foreground
                                        : secondaryColor,
                            },
                        ]}
                    >
                        Precio unitario
                    </Text>
                    <Text
                        style={[
                            styles.value,
                            {
                                color:
                                    secondaryColor === '#E0E0E0'
                                        ? colors.foreground
                                        : secondaryColor,
                            },
                        ]}
                    >
                        {detail.unitPrice.toFixed(2)} €
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color:
                                    secondaryColor === '#E0E0E0'
                                        ? colors.foreground
                                        : secondaryColor,
                            },
                        ]}
                    >
                        Subtotal
                    </Text>
                    <Text
                        style={[
                            styles.value,
                            {
                                color:
                                    secondaryColor === '#E0E0E0'
                                        ? colors.foreground
                                        : secondaryColor,
                            },
                        ]}
                    >
                        {detail.subtotal.toFixed(2)} €
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    label: {
        fontSize: 13,
        color: colors.foreground,
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.secondary,
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    column: {
        flex: 1,
    },
});
