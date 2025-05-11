import { Schema, model, Document, Types } from 'mongoose';
import { IProductCategory } from './productCategory.model';
import { IProductGroup } from './productGroup.model';
import { IUser } from './user.model';

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
    createdBy: Types.ObjectId | IUser;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: false,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'ProductGroup',
        required: false,
    },
    measurementUnit: { type: String },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export const Product = model<IProduct>('Product', productSchema);
