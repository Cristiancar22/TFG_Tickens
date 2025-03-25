import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IStore extends Document {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    createdBy: Types.ObjectId | IUser;
}

const storeSchema = new Schema<IStore>({
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Store = model<IStore>('Store', storeSchema);
