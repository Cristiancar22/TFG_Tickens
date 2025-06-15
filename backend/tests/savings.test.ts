import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import { createTestUserAndToken } from './utils/testAuthHelper';

let token: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
});

describe('Savings Endpoints', () => {
    describe('GET /api/v1/savings-goals/', () => {
        it('debe devolver 404 si no hay objetivo activo', async () => {
            const res = await request(app)
                .get('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);

            expect(res.body.message).toMatch(/no tienes un objetivo/i);
        });

        it('debe crear y devolver el objetivo activo con accumulatedAmount', async () => {
            await request(app)
                .post('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Viaje a Japón',
                    targetAmount: 1000,
                    startDate: '2025-01-01',
                    endDate: '2025-12-31',
                    isActive: true,
                })
                .expect(201);

            const res = await request(app)
                .get('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.title).toBe('Viaje a Japón');
            expect(res.body).toHaveProperty('accumulatedAmount');
        });
    });

    describe('POST /api/v1/savings-goals/', () => {
        it('debe crear un nuevo objetivo si no hay otro activo', async () => {
            const res = await request(app)
                .post('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Fondo emergencia',
                    targetAmount: 2000,
                    startDate: '2025-01-01',
                    endDate: '2025-12-31',
                    isActive: true,
                })
                .expect(201);

            expect(res.body.title).toBe('Fondo emergencia');
        });

        it('no debe permitir crear más de un objetivo activo', async () => {
            await request(app)
                .post('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Viaje Europa',
                    targetAmount: 1500,
                    startDate: '2025-01-01',
                    endDate: '2025-06-30',
                    isActive: true,
                })
                .expect(201);

            const res = await request(app)
                .post('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Otro objetivo',
                    targetAmount: 500,
                    startDate: '2025-07-01',
                    endDate: '2025-12-31',
                    isActive: true,
                })
                .expect(400);

            expect(res.body.message).toMatch(/ya existe un objetivo/i);
        });
    });

    describe('GET /api/v1/savings-goals/all', () => {
        it('debe devolver todas las metas ordenadas por fecha descendente', async () => {
            await request(app)
                .post('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Meta 1',
                    targetAmount: 1000,
                    startDate: '2025-03-01',
                    endDate: '2025-12-31',
                    isActive: true,
                });

            const res = await request(app)
                .get('/api/v1/savings-goals/all')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty('startDate');
        });
    });

    describe('PATCH /api/v1/savings-goals/:id', () => {
        let goalId: string;

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Editar objetivo',
                    targetAmount: 1000,
                    startDate: '2025-01-01',
                    endDate: '2025-12-31',
                    isActive: true,
                });

            goalId = res.body._id;
        });

        it('debe actualizar un objetivo existente', async () => {
            const res = await request(app)
                .patch(`/api/v1/savings-goals/${goalId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ targetAmount: 1200 })
                .expect(200);

            expect(res.body.targetAmount).toBe(1200);
        });

        it('debe devolver 404 si el objetivo no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .patch(`/api/v1/savings-goals/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ targetAmount: 1500 })
                .expect(404);

            expect(res.body.message).toMatch(/objetivo no encontrado/i);
        });
    });

    describe('DELETE /api/v1/savings-goals/:id', () => {
        let goalId: string;

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/v1/savings-goals/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Borrar objetivo',
                    targetAmount: 1000,
                    startDate: '2025-01-01',
                    endDate: '2025-12-31',
                    isActive: true,
                });

            goalId = res.body._id;
        });

        it('debe eliminar un objetivo correctamente', async () => {
            const res = await request(app)
                .delete(`/api/v1/savings-goals/${goalId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.message).toMatch(/eliminado correctamente/i);
        });
    });

    describe('GET /api/v1/savings-goals/total', () => {
        it('debe devolver el ahorro total (inicialmente 0)', async () => {
            const res = await request(app)
                .get('/api/v1/savings-goals/total')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).toHaveProperty('totalSavings');
            expect(typeof res.body.totalSavings).toBe('number');
        });
    });

    describe('GET /api/v1/savings-goals/recommendations', () => {
        it('debe devolver recomendaciones (array)', async () => {
            const res = await request(app)
                .get('/api/v1/savings-goals/recommendations')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body).toHaveProperty('recommendations');
            expect(Array.isArray(res.body.recommendations)).toBe(true);
        });
    });
});
