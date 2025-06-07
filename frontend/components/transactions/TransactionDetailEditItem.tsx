import { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Product } from '@/types';
import { CustomSelect } from '../ui/CustomSelect';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    productId: string | null;
    quantity: number;
    unitPrice: number;
    onUpdate: (data: {
        productId?: string;
        quantity?: number;
        unitPrice?: number;
    }) => void;
    onRemove: () => void;
    products: Product[];
    getProductById: (id: string) => Product | undefined;
};

export const TransactionDetailEditItem = ({
    productId,
    quantity,
    unitPrice,
    onUpdate,
    onRemove,
    products,
    getProductById,
}: Props) => {
    const [quantityInput, setQuantityInput] = useState(String(quantity));
    const [unitPriceInput, setUnitPriceInput] = useState(String(unitPrice));

    useEffect(() => {
        setQuantityInput(String(quantity));
    }, [quantity]);

    useEffect(() => {
        setUnitPriceInput(String(unitPrice));
    }, [unitPrice]);

    return (
        <View style={styles.container}>
            <CustomSelect
                label="Producto"
                items={products}
                selectedId={productId}
                getById={getProductById}
                onChange={(id) => onUpdate({ productId: id })}
            />

            <View style={styles.row}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Cantidad</Text>
                    <TextInput
                        value={quantityInput}
                        keyboardType="numeric"
                        onChangeText={setQuantityInput}
                        onEndEditing={() =>
                            onUpdate({
                                quantity:
                                    quantityInput.trim() === ''
                                        ? undefined
                                        : Number(quantityInput),
                            })
                        }
                        style={styles.inputField}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Precio unitario</Text>
                    <TextInput
                        value={unitPriceInput}
                        keyboardType="decimal-pad"
                        onChangeText={setUnitPriceInput}
                        onEndEditing={() =>
                            onUpdate({
                                unitPrice:
                                    unitPriceInput.trim() === ''
                                        ? undefined
                                        : parseFloat(unitPriceInput),
                            })
                        }
                        style={styles.inputField}
                    />
                </View>
            </View>

            <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
                <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.danger}
                />
                <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        color: colors.foreground,
        marginBottom: 4,
    },
    inputField: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    deleteText: {
        color: colors.danger,
        fontWeight: '500',
        marginLeft: 6,
    },
});
