import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { IProductCategory } from './productCategory.model';

export interface IBudget extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId | IUser;
    category?: Types.ObjectId | IProductCategory;
    limitAmount: number;
    startDate: Date;
    endDate?: Date;
    name?: string;
    notificationsEnabled?: boolean;
    isActive?: boolean;
}

const budgetSchema = new Schema<IBudget>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'CategoriaProducto' },
    limitAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    name: { type: String },
    notificationsEnabled: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
});

export const Budget = model<IBudget>('Budget', budgetSchema);
