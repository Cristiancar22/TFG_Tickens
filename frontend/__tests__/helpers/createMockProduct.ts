import { Product } from '@/types';

export const createMockProduct = (
    overrides: Partial<Product> = {},
): Product => ({
    id: overrides.id ?? Math.random().toString(36).slice(2),
    _id:
        overrides._id ??
        overrides.id ??
        'mock-' + Math.random().toString(36).slice(2),
    name: 'Producto genérico',
    description: '',
    brand: '',
    category: 'cat1',
    group: '',
    barcode: '',
    measurementUnit: '',
    referenceImage: '',
    ...overrides,
});
