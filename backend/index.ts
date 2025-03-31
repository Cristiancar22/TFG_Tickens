import { authRoutes, profileRoutes, ticketRoutes } from './routes';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

dotenv.config();

const app = express();

const PORT = parseInt(process.env.PORT || '5000', 10);

connectDB();

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);

app.use('/api/profile', profileRoutes);

app.use('/api/ocr', ticketRoutes);

app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
}).on('error', (error: NodeJS.ErrnoException) => {
	console.error('❌ Server failed to start:', error.message);
	process.exit(1);
});
