import { useState } from 'react';
import { Store } from '@/types';
import { useStores } from '@/store/useStore';

type FormValues = {
    name: string;
    address?: string;
};

export const useStoreManager = () => {
    const { createStore, updateStore, deleteStore } = useStores.getState();

    const [editingStore, setEditingStore] = useState<Store | null>(null);

    const handleEdit = (store: Store) => setEditingStore(store);
    const cancelEdit = () => setEditingStore(null);

    const handleSubmit = async (data: FormValues) => {
        if (editingStore) {
            await updateStore(editingStore.id, data);
        } else {
            await createStore(data);
        }
        cancelEdit();
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteStore(id);
        } catch (err) {
            console.error('Error al eliminar tienda:', err);
        }
    };

    return {
        editingStore,
        handleEdit,
        cancelEdit,
        handleSubmit,
        handleDelete,
    };
};
