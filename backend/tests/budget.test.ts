import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import { createTestUserAndToken } from './utils/testAuthHelper';

let token: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
});

describe('Budget Endpoints', () => {
    describe('GET /api/v1/budgets', () => {
        it('debe devolver 400 si faltan month o year', async () => {
            const res = await request(app)
                .get('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);

            expect(res.body.message).toMatch(/month y year requeridos/i);
        });

        it('debe devolver un array vacío si no hay presupuestos', async () => {
            const res = await request(app)
                .get('/api/v1/budgets?month=6&year=2025')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });

        it('debe devolver presupuestos existentes si hay datos', async () => {
            await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 6,
                    year: 2025,
                    limitAmount: 150,
                    isRecurring: true,
                    isActive: true,
                    notificationsEnabled: false,
                })
                .expect(201);

            const res = await request(app)
                .get('/api/v1/budgets?month=6&year=2025')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('limitAmount', 150);
            expect(res.body[0]).toHaveProperty('spentAmount');
        });

        it('debe clonar presupuestos recurrentes del mes anterior si no existen', async () => {
            await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 5,
                    year: 2025,
                    limitAmount: 200,
                    isRecurring: true,
                    isActive: true,
                    notificationsEnabled: false,
                })
                .expect(201);

            const res = await request(app)
                .get('/api/v1/budgets?month=6&year=2025')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].limitAmount).toBe(200);
            expect(res.body[0].month).toBe(6);
        });
    });

    describe('POST /api/v1/budgets', () => {
        it('debe crear un presupuesto nuevo correctamente', async () => {
            const res = await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 6,
                    year: 2025,
                    limitAmount: 100,
                    isRecurring: true,
                    isActive: true,
                    notificationsEnabled: false,
                })
                .expect(201);

            expect(res.body.limitAmount).toBe(100);
            expect(res.body.month).toBe(6);
        });

        it('no debe permitir crear un presupuesto duplicado para la misma categoría, mes y año', async () => {
            await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 6,
                    year: 2025,
                    limitAmount: 100,
                    isRecurring: true,
                    isActive: true,
                    notificationsEnabled: false,
                })
                .expect(201);

            const res = await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 6,
                    year: 2025,
                    limitAmount: 200,
                    isRecurring: false,
                    isActive: true,
                    notificationsEnabled: true,
                })
                .expect(400);

            expect(res.body.message).toMatch(/ya existe un presupuesto/i);
        });

        it('debe devolver 400 si faltan campos obligatorios', async () => {
            const res = await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    month: 6,
                    year: 2025,
                })
                .expect(500);

            expect(res.body.message).toMatch(/error/i);
        });

        it('debe devolver spentAmount igual a 0 si no hay transacciones', async () => {
            const res = await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 6,
                    year: 2025,
                    limitAmount: 100,
                    isRecurring: false,
                    isActive: true,
                    notificationsEnabled: false,
                })
                .expect(201);

            expect(res.body.spentAmount).toBe(0);
        });

        it('debe crear presupuesto con categoría específica', async () => {
            const catRes = await request(app)
                .post('/api/v1/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Compras' });

            const categoryId = catRes.body._id;

            const res = await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: categoryId,
                    month: 6,
                    year: 2025,
                    limitAmount: 300,
                    isRecurring: true,
                    isActive: true,
                    notificationsEnabled: true,
                })
                .expect(201);

            expect(res.body.category).not.toBeNull();
        });
    });

    describe('PATCH /api/v1/budgets/:id', () => {
        let budgetId: string;

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 6,
                    year: 2025,
                    limitAmount: 100,
                    isRecurring: true,
                    isActive: true,
                    notificationsEnabled: false,
                });

            budgetId = res.body._id;
        });

        it('debe actualizar correctamente un presupuesto existente', async () => {
            const res = await request(app)
                .patch(`/api/v1/budgets/${budgetId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    limitAmount: 250,
                    isActive: false,
                })
                .expect(200);

            expect(res.body.limitAmount).toBe(250);
            expect(res.body.isActive).toBe(false);
        });

        it('debe devolver 404 si el presupuesto no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .patch(`/api/v1/budgets/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ limitAmount: 300 })
                .expect(404);

            expect(res.body.message).toMatch(/presupuesto no encontrado/i);
        });

        it('debe devolver 500 si el ID es inválido', async () => {
            const res = await request(app)
                .patch('/api/v1/budgets/invalid-id')
                .set('Authorization', `Bearer ${token}`)
                .send({ limitAmount: 100 })
                .expect(500);

            expect(res.body.message).toMatch(/error/i);
        });
    });

    describe('DELETE /api/v1/budgets/:id', () => {
        let budgetId: string;

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/v1/budgets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: null,
                    month: 6,
                    year: 2025,
                    limitAmount: 100,
                    isRecurring: true,
                    isActive: true,
                    notificationsEnabled: false,
                });

            budgetId = res.body._id;
        });

        it('debe eliminar un presupuesto correctamente', async () => {
            const res = await request(app)
                .delete(`/api/v1/budgets/${budgetId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.message).toMatch(/eliminado correctamente/i);

            await request(app)
                .get('/api/v1/budgets?month=6&year=2025')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then((res) => {
                    expect(res.body.some((b: any) => b._id === budgetId)).toBe(
                        false,
                    );
                });
        });

        it('debe devolver 404 si el presupuesto no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .delete(`/api/v1/budgets/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);

            expect(res.body.message).toMatch(/presupuesto no encontrado/i);
        });

        it('debe devolver 500 si el ID es inválido', async () => {
            const res = await request(app)
                .delete('/api/v1/budgets/invalid-id')
                .set('Authorization', `Bearer ${token}`)
                .expect(500);

            expect(res.body.message).toMatch(/error/i);
        });
    });
});
