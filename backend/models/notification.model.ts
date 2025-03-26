import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface INotification extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	type?: string;
	message?: string;
	creationDate?: Date;
	status?: string;
}

const notificationSchema = new Schema<INotification>({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	type: { type: String },
	message: { type: String },
	creationDate: { type: Date, default: Date.now },
	status: { type: String, default: 'pending' },
});

export const Notification = model<INotification>(
	'Notification',
	notificationSchema
);
