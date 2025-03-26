import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { authRoutes } from './routes';

dotenv.config();

const app = express();

const PORT = parseInt(process.env.PORT || '5000', 10);

connectDB();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).send('Hello World');
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
}).on('error', (error: NodeJS.ErrnoException) => {
	console.error('❌ Server failed to start:', error.message);
	process.exit(1);
});
