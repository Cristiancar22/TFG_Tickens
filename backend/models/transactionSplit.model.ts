import { Schema, model, Document, Types } from 'mongoose';
import { ITransaction } from './transaction.model';
import { IUser } from './user.model';

export interface ITransactionSplit extends Document {
    transaccion: Types.ObjectId | ITransaction;
    user: Types.ObjectId | IUser;
    assignedAmount: number;
}

const transactionSplitSchema = new Schema<ITransactionSplit>({
    transaccion: { type: Schema.Types.ObjectId, ref: 'Transaccion', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAmount: { type: Number, default: 0 }
});

export const TransactionSplit = model<ITransactionSplit>(
    'TransactionSplit',
    transactionSplitSchema
);
