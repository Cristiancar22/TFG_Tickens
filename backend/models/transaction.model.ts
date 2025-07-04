import { Schema, model, Document, Types } from 'mongoose';
import { ITicket } from './ticket.model';
import { IUser } from './user.model';
import { IStore } from './store.model';

export interface ITransaction extends Document {
    _id: Types.ObjectId;
    ticket?: Types.ObjectId | ITicket;
    user: Types.ObjectId | IUser;
    store: Types.ObjectId | IStore;
    purchaseDate: Date;
    total?: number;
    paymentMethod?: string;
    transactionCategory?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: false },
        purchaseDate: { type: Date, required: true },
        total: { type: Number, default: 0 },
        paymentMethod: { type: String },
        transactionCategory: { type: String },
        notes: { type: String },
    },
    { timestamps: true },
);

export const Transaction = model<ITransaction>(
    'Transaction',
    transactionSchema,
);
