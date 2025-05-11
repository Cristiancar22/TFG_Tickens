import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        await import('../models'); 

        logger.info('MongoDB conectado correctamente');
    } catch (error) {
        logger.error('Error al conectar a MongoDB', error);
        process.exit(1);
    }
};
