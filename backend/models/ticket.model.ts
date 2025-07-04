import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { OcrResponse } from '../types';

export interface ITicket extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId | IUser;
    scanDate?: Date;
    rawData?: string;
    processingStatus?: string;
    totalScanned?: number;
    ocrMetadata?: OcrResponse;
    createdAt?: Date;
    updatedAt?: Date;
}

const ticketSchema = new Schema<ITicket>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        scanDate: { type: Date },
        rawData: { type: String },
        processingStatus: { type: String, default: 'pending' },
        totalScanned: { type: Number },
        ocrMetadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true },
);

export const Ticket = model<ITicket>('Ticket', ticketSchema);
