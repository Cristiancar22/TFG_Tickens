import { View, TextInput, Button } from 'react-native';
import { useProductManager } from '@/hooks/manageProduct/useProductManager';

export const ProductForm = () => {
    const {
        formValues,
        setFormValue,
        handleSubmit,
        isEditing,
        cancelEdit,
    } = useProductManager();

    return (
        <View className="p-4">
            <TextInput
                placeholder="Nombre del producto"
                value={formValues.name}
                onChangeText={(text) => setFormValue('name', text)}
                className="border px-2 py-1 mb-2"
            />
            <Button title={isEditing ? 'Actualizar' : 'Crear'} onPress={handleSubmit} />
            {isEditing && <Button title="Cancelar" onPress={cancelEdit} color="red" />}
        </View>
    );
};
