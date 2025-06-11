import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface ISavingsGoal extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId | IUser;
    title: string;
    description?: string;
    targetAmount: number;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
}

const savingsGoalSchema = new Schema<ISavingsGoal>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    targetAmount: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
});

export const SavingsGoal = model<ISavingsGoal>(
    'SavingsGoal',
    savingsGoalSchema,
);
