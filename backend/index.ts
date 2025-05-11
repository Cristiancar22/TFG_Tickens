import {
    authRoutes,
    productRoutes,
    profileRoutes,
    storeRoutes,
    ticketRoutes,
    transactionRoutes,
} from './routes';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { logger } from './utils/logger';

dotenv.config();

const app = express();

const PORT = parseInt(process.env.PORT || '5000', 10);

connectDB();

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);

app.use('/api/profile', profileRoutes);

app.use('/api/ticket', ticketRoutes);

app.use('/api/transactions', transactionRoutes);

app.use('/api/product', productRoutes);

app.use('/api/store', storeRoutes);

app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
}).on('error', (error: NodeJS.ErrnoException) => {
    logger.error('Server failed to start:', error.message);
    process.exit(1);
});
