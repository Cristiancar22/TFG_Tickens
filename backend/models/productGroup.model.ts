import { Schema, model, Document } from 'mongoose';

export interface IProductGroup extends Document {
    name: string;
    description?: string;
}

const productGroupSchema = new Schema<IProductGroup>({
    name: { type: String, required: true },
    description: { type: String }
});

export const ProductGroup = model<IProductGroup>('ProductGroup', productGroupSchema);
