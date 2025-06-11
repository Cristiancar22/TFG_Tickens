import {
    authRoutes,
    budgetRoutes,
    categoryRoutes,
    notificationsRoutes,
    productRoutes,
    profileRoutes,
    savingsRoutes,
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

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

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

app.use('/api/v1/notifications', notificationsRoutes);

app.use('/api/v1/savings-goals', savingsRoutes);

export default app;