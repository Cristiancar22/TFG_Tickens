import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import { Transaction } from '../models/transaction.model';
import { createTestUserAndToken } from './utils/testAuthHelper';
import dayjs from 'dayjs';

let token: string;
let userId: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
    userId = result.user._id.toString();
});

afterEach(async () => {
    await Transaction.deleteMany({});
});

describe('GET /api/v1/user-stats', () => {
    it('debe devolver estadísticas correctas para el mes actual', async () => {
        const now = new Date();

        await Transaction.create([
            {
                user: userId,
                purchaseDate: now,
                store: new mongoose.Types.ObjectId(),
                total: 10,
            },
            {
                user: userId,
                purchaseDate: now,
                store: new mongoose.Types.ObjectId(),
                total: 15.5,
            },
        ]);

        const res = await request(app)
            .get('/api/v1/user-stats')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.currentMonthTransactionCount).toBe(2);
        expect(res.body.currentMonthSpending).toBeCloseTo(25.5);
    });

    it('debe devolver 0 si no hay transacciones este mes', async () => {
        const lastMonth = dayjs().subtract(1, 'month').toDate();

        await Transaction.create({
            user: userId,
            purchaseDate: lastMonth,
            store: new mongoose.Types.ObjectId(),
            total: 100,
        });

        const res = await request(app)
            .get('/api/v1/user-stats')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.currentMonthTransactionCount).toBe(0);
        expect(res.body.currentMonthSpending).toBe(0);
    });
});
