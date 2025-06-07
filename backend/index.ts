import {
    authRoutes,
    budgetRoutes,
    categoryRoutes,
    productRoutes,
    profileRoutes,
    statsRoutes,
    storeRoutes,
    ticketRoutes,
    transactionRoutes,
    userStatsRoutes,
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

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/profile', profileRoutes);

app.use('/api/v1/ticket', ticketRoutes);

app.use('/api/v1/transactions', transactionRoutes);

app.use('/api/v1/product', productRoutes);

app.use('/api/v1/store', storeRoutes);

app.use('/api/v1/user-stats', userStatsRoutes);

app.use('/api/v1/categories', categoryRoutes);

app.use('/api/v1/stats', statsRoutes);

app.use('/api/v1/budgets', budgetRoutes);

app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
}).on('error', (error: NodeJS.ErrnoException) => {
    logger.error('Server failed to start:', error.message);
    process.exit(1);
});
