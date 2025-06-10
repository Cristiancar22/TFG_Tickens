import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { MONGO_URI } from './env';

dotenv.config();

export const connectDB = async () => {
    if (!MONGO_URI) {
        throw new Error('MONGO_URI no definido');
    }

    try {
        await mongoose.connect(MONGO_URI);
        logger.info('Conectado a MongoDB');
    } catch (error) {
        logger.error('Error al conectar a MongoDB', error);
        process.exit(1);
    }
};
