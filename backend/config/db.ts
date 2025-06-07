import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { MONGO_URI } from './env';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI!);

        await import('../models'); 

        logger.info('MongoDB conectado correctamente');
    } catch (error) {
        logger.error('Error al conectar a MongoDB', error);
        process.exit(1);
    }
};
