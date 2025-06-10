import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface INotification extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId | IUser;
    type: 'alert' | 'suggestion' | 'reminder';
    message: string;
    creationDate: Date;
    status: 'pending' | 'read' | 'archived';
}

const notificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['alert', 'suggestion', 'reminder'], required: true },
    message: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'read', 'archived'], default: 'pending' },
});

notificationSchema.index({ user: 1, status: 1 });

export const Notification = model<INotification>(
    'Notification',
    notificationSchema,
);
