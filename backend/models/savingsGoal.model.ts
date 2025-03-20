import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface ISavingsGoal extends Document {
    user: Types.ObjectId | IUser;
    title: string;
    targetAmount: number;
    startDate?: Date;
    endDate?: Date;
    accumulatedAmount?: number;
}

const savingsGoalSchema = new Schema<ISavingsGoal>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    accumulatedAmount: { type: Number, default: 0 }
});

export const SavingsGoal = model<ISavingsGoal>('SavingsGoal', savingsGoalSchema);
