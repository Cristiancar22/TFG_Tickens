/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    surname?: string;
    email: string;
    passwordHash: string;
    registrationDate?: Date;
    accountStatus?: string;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;

    comparePassword: (candidate: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        surname: { type: String },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true, select: false },
        registrationDate: { type: Date, default: Date.now },
        accountStatus: { type: String, default: 'active' },
        avatarUrl: { type: String, default: '' },
    },
    { timestamps: true },
);

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (err) {
        next(err as any);
    }
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = model<IUser>('User', userSchema);
