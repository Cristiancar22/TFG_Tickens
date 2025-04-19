import { Schema, model, Document, Types } from 'mongoose';
import { IProductCategory } from './productCategory.model';
import { IProductGroup } from './productGroup.model';

export interface IProduct extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    brand?: string;
    category: Types.ObjectId | IProductCategory;
    group: Types.ObjectId | IProductGroup;
    barcode?: string;
    measurementUnit?: string;
    referenceImage?: string;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'CategoriaProduct',
        required: false,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'GrupoProduct',
        required: false,
    },
    barcode: { type: String },
    measurementUnit: { type: String },
    referenceImage: { type: String },
});

export const Product = model<IProduct>('Product', productSchema);
