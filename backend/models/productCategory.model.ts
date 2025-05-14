import { Schema, model, Document, Types } from 'mongoose';

export interface IProductCategory extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    icon?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

const productCategorySchema = new Schema<IProductCategory>({
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    primaryColor: { type: String },
    secondaryColor: { type: String },
});

export const ProductCategory = model<IProductCategory>(
    'ProductCategory',
    productCategorySchema,
);
