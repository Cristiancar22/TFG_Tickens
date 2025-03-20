import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    surname?: string;
    email: string;
    passwordHash: string;
    registrationDate?: Date;
    accountStatus?: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    surname: { type: String },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    accountStatus: { type: String, default: 'active' },
});

export const User = model<IUser>('User', userSchema);
