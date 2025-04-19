import { Schema, model, Document, Types } from 'mongoose';

export interface IProductCategory extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
}

const productCategorySchema = new Schema<IProductCategory>({
    name: { type: String, required: true },
    description: { type: String },
});

export const ProductCategory = model<IProductCategory>(
    'ProductCategory',
    productCategorySchema,
);
