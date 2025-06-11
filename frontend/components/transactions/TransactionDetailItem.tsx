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

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: primaryColor, borderColor: secondaryColor },
            ]}
            accessibilityLabel="transaction-detail-item"
        >
            {/* Producto */}
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
                    accessibilityLabel="label-product"
                >
                    Producto
                </Text>

                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={secondaryColor}
                        accessibilityLabel="product-icon"
                    />
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
                accessibilityLabel="product-name"
            >
                {product?.name ?? 'Producto desconocido'}
            </Text>

            {/* Cantidad, Precio unitario, Subtotal */}
            <View style={styles.row}>
                {/* Cantidad */}
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
                        accessibilityLabel="label-quantity"
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
                        accessibilityLabel="detail-quantity"
                    >
                        {detail.quantity}
                    </Text>
                </View>

                {/* Precio unitario */}
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
                        accessibilityLabel="label-unit-price"
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
                        accessibilityLabel="detail-unit-price"
                    >
                        {detail.unitPrice.toFixed(2)} €
                    </Text>
                </View>

                {/* Subtotal */}
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
                        accessibilityLabel="label-subtotal"
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
                        accessibilityLabel="detail-subtotal"
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
