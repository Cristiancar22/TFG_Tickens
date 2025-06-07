// useProductManager.ts
import { useState } from 'react';
import { Product } from '@/types';
import { useProducts } from '@/store/useProduct';

type FormValues = {
    name: string;
    description?: string;
};

export const useProductManager = () => {
    const { createProduct, updateProduct, deleteProduct } = useProducts.getState();

    const [formValues, setFormValues] = useState<FormValues>({ name: '' });
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    const isEditing = !!editingProductId;

    const handleEdit = (product: Product) => {
        setFormValues({ name: product.name, description: product.description });
        setEditingProductId(product.id);
    };

    const cancelEdit = () => {
        setFormValues({ name: '' });
        setEditingProductId(null);
    };

    const setFormValue = (key: keyof FormValues, value: string) => {
        setFormValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditing && editingProductId) {
                await updateProduct(editingProductId, formValues);
            } else {
                await createProduct(formValues);
            }
            cancelEdit();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id); // asegúrate de tener esta función en Zustand
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    return {
        formValues,
        setFormValue,
        handleSubmit,
        isEditing,
        handleEdit,
        cancelEdit,
        handleDelete,
    };
};
