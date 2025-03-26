import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IProductGroup extends Document {
	_id: Types.ObjectId;
	name: string;
	description?: string;
	createdBy: Types.ObjectId | IUser;
}

const productGroupSchema = new Schema<IProductGroup>({
	name: { type: String, required: true },
	description: { type: String },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const ProductGroup = model<IProductGroup>(
	'ProductGroup',
	productGroupSchema
);
