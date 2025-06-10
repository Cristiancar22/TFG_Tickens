import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import { createTestUserAndToken } from './utils/testAuthHelper';
import { Transaction } from '../models/transaction.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import { Product } from '../models/product.model';
import { Store } from '../models/store.model';

let token: string;
let userId: string;
let productId: mongoose.Types.ObjectId;
let storeId: mongoose.Types.ObjectId;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
    userId = result.user._id.toString();

    const product = await Product.create({ name: 'Pan', createdBy: userId });
    const store = await Store.create({ name: 'Mercadona', createdBy: userId });

    productId = product._id;
    storeId = store._id;
});

afterEach(async () => {
    await Transaction.deleteMany({});
    await TransactionDetail.deleteMany({});
    await Product.deleteMany({});
    await Store.deleteMany({});
});

describe('Transaction Endpoints', () => {
    describe('POST /api/v1/transactions', () => {
        it('debe crear una transacción con detalles', async () => {
            const res = await request(app)
                .post('/api/v1/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    store: storeId,
                    purchaseDate: new Date().toISOString(),
                    total: 2.5,
                    paymentMethod: 'cash',
                    notes: 'Compra de prueba',
                    details: [
                        {
                            product: productId,
                            quantity: 1,
                            unitPrice: 2.5,
                            subtotal: 2.5,
                        },
                    ],
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.transactionId).toBeDefined();
        });
    });

    describe('GET /api/v1/transactions', () => {
        it('debe devolver las transacciones recientes', async () => {
            await Transaction.create({
                user: userId,
                store: storeId,
                purchaseDate: new Date(),
                total: 5,
            });

            const res = await request(app)
                .get('/api/v1/transactions')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/transactions/:id', () => {
        it('debe devolver una transacción con sus detalles', async () => {
            const transaction = await Transaction.create({
                user: userId,
                store: storeId,
                purchaseDate: new Date(),
                total: 3,
            });

            await TransactionDetail.create({
                transaction: transaction._id,
                product: productId,
                quantity: 1,
                unitPrice: 3,
                subtotal: 3,
            });

            const res = await request(app)
                .get(`/api/v1/transactions/${transaction._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.details).toBeDefined();
            expect(res.body.details.length).toBeGreaterThan(0);
        });

        it('debe devolver 404 si la transacción no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get(`/api/v1/transactions/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/no encontrada/i);
        });
    });

    describe('PUT /api/v1/transactions/:id', () => {
        it('debe actualizar una transacción existente', async () => {
            const transaction = await Transaction.create({
                user: userId,
                store: storeId,
                purchaseDate: new Date(),
                total: 4,
            });

            const res = await request(app)
                .put(`/api/v1/transactions/${transaction._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    _id: transaction._id,
                    store: storeId,
                    purchaseDate: new Date().toISOString(),
                    notes: 'Actualizada',
                    details: [
                        {
                            product: productId,
                            quantity: 2,
                            unitPrice: 1.5,
                        },
                    ],
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('debe devolver 404 si la transacción no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .put(`/api/v1/transactions/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    _id: fakeId,
                    store: storeId,
                    purchaseDate: new Date().toISOString(),
                    details: [],
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/no encontrada/i);
        });
    });
});
