import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import { Store } from '../models/store.model';
import { Transaction } from '../models/transaction.model';
import { createTestUserAndToken } from './utils/testAuthHelper';

let token: string;
let userId: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
    userId = result.user._id.toString();
});

afterEach(async () => {
    await Store.deleteMany({});
    await Transaction.deleteMany({});
});

describe('Store Endpoints', () => {
    describe('GET /api/v1/store', () => {
        it('debe devolver tiendas del usuario autenticado', async () => {
            await Store.create({ name: 'Mercadona', createdBy: userId });
            await Store.create({ name: 'Dia', createdBy: userId });

            const res = await request(app)
                .get('/api/v1/store')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('POST /api/v1/store', () => {
        it('debe crear una nueva tienda', async () => {
            const res = await request(app)
                .post('/api/v1/store')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Carrefour' });

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe('Carrefour');
            expect(res.body.createdBy).toBe(userId);
        });
    });

    describe('PATCH /api/v1/store/:id', () => {
        it('debe actualizar una tienda existente', async () => {
            const store = await Store.create({ name: 'Lidl', createdBy: userId });

            const res = await request(app)
                .patch(`/api/v1/store/${store._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Lidl Express' });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Lidl Express');
        });

        it('debe devolver 404 si la tienda no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .patch(`/api/v1/store/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'No existe' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Tienda no encontrada');
        });
    });

    describe('DELETE /api/v1/store/:id', () => {
        it('debe eliminar una tienda existente', async () => {
            const store = await Store.create({ name: 'Consum', createdBy: userId });

            const res = await request(app)
                .delete(`/api/v1/store/${store._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Tienda eliminada correctamente');
        });

        it('debe devolver 404 si la tienda no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/v1/store/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Tienda no encontrada');
        });
    });

    describe('POST /api/v1/store/group', () => {
        it('debe agrupar tiendas correctamente', async () => {
            const mainStore = await Store.create({ name: 'Principal', createdBy: userId });
            const secondary = await Store.create({ name: 'Secundaria', createdBy: userId });

            await Transaction.create({
                user: userId,
                store: secondary._id,
                purchaseDate: new Date(),
                total: 10,
            });

            const res = await request(app)
                .post('/api/v1/store/group')
                .set('Authorization', `Bearer ${token}`)
                .send({ mainId: mainStore._id, groupedIds: [mainStore._id, secondary._id] });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Tiendas agrupadas correctamente');

            const updatedTransaction = await Transaction.findOne({ store: mainStore._id });
            expect(updatedTransaction).not.toBeNull();
        });

        it('debe devolver 400 si solo se incluye la tienda principal', async () => {
            const store = await Store.create({ name: 'Única', createdBy: userId });

            const res = await request(app)
                .post('/api/v1/store/group')
                .set('Authorization', `Bearer ${token}`)
                .send({ mainId: store._id, groupedIds: [store._id] });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('No se puede agrupar solo la tienda principal');
        });
    });
});
