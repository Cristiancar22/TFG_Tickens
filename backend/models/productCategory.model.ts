import { Schema, model, Document } from 'mongoose';

export interface IProductCategory extends Document {
    name: string;
    description?: string;
}

const productCategorySchema = new Schema<IProductCategory>({
    name: { type: String, required: true },
    description: { type: String },
});

export const ProductCategory = model<IProductCategory>(
    'ProductCategory',
    productCategorySchema
);
