import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { IProductCategory } from './productCategory.model';

export interface IBudget extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId | IUser;
    category?: Types.ObjectId | IProductCategory;
    limitAmount: number;
    spentAmount: number;
    month: number;
    year: number;
    notificationsEnabled: boolean;
    isActive: boolean;
    isRecurring: boolean;
}

const budgetSchema = new Schema<IBudget>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
    limitAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    notificationsEnabled: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isRecurring: { type: Boolean, default: false },
});

export const Budget = model<IBudget>('Budget', budgetSchema);
