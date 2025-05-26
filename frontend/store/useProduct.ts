import { create } from 'zustand';
import { Product } from '@/types';
import {
    getProducts,
    createProduct as createProductService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
    groupProducts as groupProductsService,
} from '@/services/product.service';

type ProductsState = {
    products: Product[];
    setProducts: (products: Product[]) => void;
    fetchProducts: () => Promise<void>;
    createProduct: (data: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (
        id: string,
        data: Partial<Omit<Product, 'id'>>,
    ) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProductById: (id: string) => Product | undefined;
    groupProducts: (mainId: string, groupedIds: string[]) => Promise<void>;
};

export const useProducts = create<ProductsState>((set, get) => ({
    products: [],
    setProducts: (products) => set({ products }),

    fetchProducts: async () => {
        try {
            const products = await getProducts();
            set({ products });
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    },

    createProduct: async (data) => {
        try {
            const newProduct = await createProductService(data);
            const current = get().products;
            set({ products: [...current, newProduct] });
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    },

    updateProduct: async (id, data) => {
        try {
            const updatedProduct = await updateProductService(id, data);
            const current = get().products;

            const updatedProducts = current.map((product) =>
                product.id === id ? updatedProduct : product,
            );

            set({ products: updatedProducts });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    },

    deleteProduct: async (id: string) => {
        try {
            await deleteProductService(id);
            set({ products: get().products.filter((p) => p.id !== id) });
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            throw err;
        }
    },

    getProductById: (id) => {
        return get().products.find((product) => product.id === id);
    },

    groupProducts: async (mainId, groupedIds) => {
        try {
            await groupProductsService({ mainId, groupedIds });

            const updatedProducts = get().products.filter(
                (p) => !groupedIds.includes(p.id) || p.id === mainId,
            );

            set({ products: updatedProducts });
        } catch (error) {
            console.error('Error al agrupar productos:', error);
            throw error;
        }
    },
}));
