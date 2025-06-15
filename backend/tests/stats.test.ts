import request from 'supertest';
import app from '../index';
import { createTestUserAndToken } from './utils/testAuthHelper';
import { Transaction } from '../models/transaction.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import { Product } from '../models/product.model';
import { ProductCategory } from '../models/productCategory.model';
import mongoose from 'mongoose';

let token: string;
let userId: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
    userId = result.user._id.toString();
});

afterEach(async () => {
    await Transaction.deleteMany({});
    await TransactionDetail.deleteMany({});
    await Product.deleteMany({});
    await ProductCategory.deleteMany({});
});

describe('Stats Endpoints', () => {
    describe('GET /api/v1/stats (monthly)', () => {
        it('debe devolver estadísticas mensuales por categoría', async () => {
            const category = await ProductCategory.create({
                name: 'Comida',
                primaryColor: '#ff0000',
            });

            const product = await Product.create({
                name: 'Pan',
                category: category._id,
                createdBy: userId,
            });

            const transaction = await Transaction.create({
                user: userId,
                purchaseDate: new Date('2024-06-15'),
                store: new mongoose.Types.ObjectId(),
                total: 3.5,
            });

            await TransactionDetail.create({
                transaction: transaction._id,
                product: product._id,
                unitPrice: 3.5,
                quantity: 1,
                subtotal: 3.5,
            });

            const res = await request(app)
                .get('/api/v1/stats')
                .query({ viewType: 'monthly', year: 2024, month: 6 })
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('label', 'Comida');
            expect(res.body[0]).toHaveProperty('value');
            expect(res.body[0]).toHaveProperty('color');
        });
    });

    describe('GET /api/v1/stats (annual)', () => {
        it('debe devolver estadísticas anuales por mes', async () => {
            await Transaction.create({
                user: userId,
                purchaseDate: new Date('2024-03-10'),
                store: new mongoose.Types.ObjectId(),
                total: 20,
            });

            const res = await request(app)
                .get('/api/v1/stats')
                .query({ viewType: 'annual', year: 2024 })
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.find((m: any) => m.label === 'Mar')).toBeDefined();
        });
    });

    describe('GET /api/v1/stats/prediction', () => {
        it('debe devolver predicción de gastos por categoría', async () => {
            const category = await ProductCategory.create({
                name: 'Tecnología',
                primaryColor: '#00ff00',
            });

            const product = await Product.create({
                name: 'Ratón',
                category: category._id,
                createdBy: userId,
            });

            const transaction = await Transaction.create({
                user: userId,
                purchaseDate: new Date('2023-06-10'),
                store: new mongoose.Types.ObjectId(),
                total: 15,
            });

            await TransactionDetail.create({
                transaction: transaction._id,
                product: product._id,
                unitPrice: 15,
                quantity: 1,
                subtotal: 15,
            });

            const res = await request(app)
                .get('/api/v1/stats/prediction')
                .query({ year: 2024, month: 6 })
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty('label', 'Tecnología');
            expect(res.body[0]).toHaveProperty('value');
            expect(res.body[0]).toHaveProperty('color');
        });
    });
});
