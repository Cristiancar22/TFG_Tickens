import { Schema, model, Document } from 'mongoose';

export interface IStore extends Document {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
}

const storeSchema = new Schema<IStore>({
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
});

export const Store = model<IStore>('Store', storeSchema);
