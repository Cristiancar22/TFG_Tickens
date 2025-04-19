import { Schema, model, Document, Types } from 'mongoose';
import { ITransaction } from './transaction.model';
import { IProduct } from './product.model';

export interface ITransactionDetail extends Document {
	_id: Types.ObjectId;
	transaccion: Types.ObjectId | ITransaction;
	producto: Types.ObjectId | IProduct;
	quantity: number;
	unitPrice: number;
	subtotal: number;
}

const transactionDetailSchema = new Schema<ITransactionDetail>({
	transaccion: {
		type: Schema.Types.ObjectId,
		ref: 'Transaccion',
		required: true,
	},
	producto: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
	quantity: { type: Number, default: 1 },
	unitPrice: { type: Number, default: 0 },
	subtotal: { type: Number, default: 0 },
});

export const TransactionDetail = model<ITransactionDetail>(
	'TransactionDetail',
	transactionDetailSchema
);
