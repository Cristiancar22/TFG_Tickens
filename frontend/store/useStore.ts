import { create } from 'zustand';
import { Store } from '@/types';
import {
    getStores,
    createStore as createStoreService,
    updateStore as updateStoreService,
    deleteStore as deleteStoreService,
    groupStores as groupStoresService,
} from '@/services/store.service';

type StoresState = {
    stores: Store[];
    setStores: (stores: Store[]) => void;
    fetchStores: () => Promise<void>;
    createStore: (data: Omit<Store, 'id'>) => Promise<void>;
    updateStore: (
        id: string,
        data: Partial<Omit<Store, 'id'>>,
    ) => Promise<void>;
    deleteStore: (id: string) => Promise<void>;
    getStoreById: (id: string) => Store | undefined;
    groupStores: (mainId: string, groupedIds: string[]) => Promise<void>;
};

export const useStores = create<StoresState>((set, get) => ({
    stores: [],
    setStores: (stores) => set({ stores }),

    fetchStores: async () => {
        try {
            const stores = await getStores();
            set({ stores });
        } catch (error) {
            console.error('Error al cargar tiendas:', error);
        }
    },

    createStore: async (data) => {
        try {
            const newStore = await createStoreService(data);
            const current = get().stores;
            set({ stores: [...current, newStore] });
        } catch (error) {
            console.error('Error al crear tienda:', error);
            throw error;
        }
    },

    updateStore: async (id, data) => {
        try {
            const updatedStore = await updateStoreService(id, data);
            const current = get().stores;

            const updatedStores = current.map((store) =>
                store.id === id ? updatedStore : store,
            );

            set({ stores: updatedStores });
        } catch (error) {
            console.error('Error al actualizar tienda:', error);
            throw error;
        }
    },

    deleteStore: async (id: string) => {
        try {
            await deleteStoreService(id);
            set({ stores: get().stores.filter((p) => p.id !== id) });
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            throw err;
        }
    },

    getStoreById: (id) => {
        return get().stores.find((store) => store.id === id);
    },

    groupStores: async (mainId, groupedIds) => {
        try {
            await groupStoresService({ mainId, groupedIds });

            const toRemove = groupedIds.filter((id) => id !== mainId);
            set({
                stores: get().stores.filter(
                    (store) => !toRemove.includes(store.id),
                ),
            });
        } catch (error) {
            console.error('Error al agrupar tiendas:', error);
            throw error;
        }
    },
}));
