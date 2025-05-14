import { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { Product } from '@/types';
import { CustomSelect } from '../ui/CustomSelect';
import { colors } from '@/constants/colors';

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

    // Mantener sincronizado con cambios externos
    useEffect(() => {
        setQuantityInput(String(quantity));
    }, [quantity]);

    useEffect(() => {
        setUnitPriceInput(String(unitPrice));
    }, [unitPrice]);

    return (
        <View
            className="rounded-xl p-4 mb-4"
            style={{
                backgroundColor: '#F9F9F9',
                borderColor: '#E0E0E0',
                borderWidth: 1,
            }}
        >
            <CustomSelect
                label="Producto"
                items={products}
                selectedId={productId}
                getById={getProductById}
                onChange={(id) => onUpdate({ productId: id })}
            />

            <Text className="font-semibold">Cantidad</Text>
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
                className="border rounded p-2 my-1"
            />

            <Text className="font-semibold">Precio unitario</Text>
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
                className="border rounded p-2 my-1"
            />

            <Pressable
                onPress={onRemove}
                className="mt-2"
                style={{ alignSelf: 'flex-end' }}
            >
                <Text style={{ color: colors.danger, fontWeight: '500' }}>
                    Eliminar
                </Text>
            </Pressable>
        </View>
    );
};
