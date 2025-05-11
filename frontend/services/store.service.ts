import axios from 'axios';
import { api } from './api';
import { Store } from '@/types';

type UpdateStoreData = Partial<Omit<Store, 'id'>>;

export const getStores = async (): Promise<Store[]> => {
    try {
        const response = await api.get('/store');
        return response.data.map((store: Store) => ({
            ...store,
            id: store._id,
        }));
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al obtener las tiendas');
    }
};

export const updateStore = async (
    id: string,
    data: UpdateStoreData,
): Promise<Store> => {
    try {
        const response = await api.patch(`/store/${id}`, data);
        const store = response.data;
        return {
            ...store,
            id: store._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al actualizar la tienda');
    }
};

export const createStore = async (
    data: Omit<UpdateStoreData, 'id'>,
): Promise<Store> => {
    try {
        const response = await api.post('/store', data);
        const store = response.data;
        return {
            ...store,
            id: store._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al crear la tienda');
    }
};

export const deleteStore = async (
    id: string
): Promise<void> => {
    try {
        await api.delete(`/store/${id}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al eliminar la tienda');
    }
};
