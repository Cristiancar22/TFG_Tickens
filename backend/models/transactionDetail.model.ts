import { Schema, model, Document, Types } from 'mongoose';
import { ITransaction } from './transaction.model';
import { IProduct } from './product.model';

export interface ITransactionDetail extends Document {
    _id: Types.ObjectId;
    transaction: Types.ObjectId | ITransaction;
    product: Types.ObjectId | IProduct;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

const transactionDetailSchema = new Schema<ITransactionDetail>({
    transaction: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
    },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
});

export const TransactionDetail = model<ITransactionDetail>(
    'TransactionDetail',
    transactionDetailSchema,
);
