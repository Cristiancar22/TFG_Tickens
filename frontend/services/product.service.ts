import axios from 'axios';
import { api } from './api';
import { Product } from '@/types';

type UpdateProductData = Partial<Omit<Product, 'id'>>;

type GroupProductsPayload = {
    mainId: string;
    groupedIds: string[];
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/product');
        return response.data.map((product: Product) => ({
            ...product,
            id: product._id,
        }));
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al obtener los productos');
    }
};

export const updateProduct = async (
    id: string,
    data: UpdateProductData,
): Promise<Product> => {
    try {
        const response = await api.patch(`/product/${id}`, data);
        const product = response.data;

        return {
            ...product,
            id: product._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al actualizar el producto');
    }
};

export const createProduct = async (
    data: Omit<UpdateProductData, 'id'>,
): Promise<Product> => {
    try {
        const response = await api.post('/product', data);
        const product = response.data;
        return {
            ...product,
            id: product._id,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al crear el producto');
    }
};

export const deleteProduct = async (
    id: string
): Promise<void> => {
    try {
        await api.delete(`/product/${id}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al eliminar el producto');
    }
};

export const groupProducts = async (
    data: GroupProductsPayload
): Promise<void> => {
    try {
        await api.post('/product/group', data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }

        throw new Error('Error al agrupar productos');
    }
};
