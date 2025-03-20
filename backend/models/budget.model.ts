import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { IProductCategory } from './productCategory.model';

export interface IProduct extends Document {
    user: Types.ObjectId | IUser;
    category?: Types.ObjectId | IProductCategory;
    limitAmount: number;
    startDate: Date;
    endDate?: Date;
    budgetName?: string;
    notificationsEnabled?: boolean;
}

const productSchema = new Schema<IProduct>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'CategoriaProducto' },
    limitAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    budgetName: { type: String },
    notificationsEnabled: { type: Boolean, default: true }
});

export const Product = model<IProduct>('Product', productSchema);
