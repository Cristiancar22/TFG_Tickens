import request from 'supertest';
import app from '../index';
import { Product } from '../models/product.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import mongoose from 'mongoose';
import { createTestUserAndToken } from './utils/testAuthHelper';

let token: string;
let userId: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
    userId = result.user._id.toString();
});

afterEach(async () => {
    await Product.deleteMany({});
    await TransactionDetail.deleteMany({});
});

describe('Product Endpoints', () => {
    describe('GET /api/v1/product', () => {
        it('debe devolver productos creados por el usuario', async () => {
            await Product.create([
                { name: 'Producto 1', createdBy: userId },
                { name: 'Producto 2', createdBy: userId },
            ]);

            const res = await request(app)
                .get('/api/v1/product')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('POST /api/v1/product', () => {
        it('debe crear un nuevo producto', async () => {
            const res = await request(app)
                .post('/api/v1/product')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Nuevo producto' });

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe('Nuevo producto');
            expect(res.body.createdBy).toBe(userId);
        });
    });

    describe('PATCH /api/v1/product/:id', () => {
        it('debe actualizar un producto existente', async () => {
            const product = await Product.create({
                name: 'Original',
                createdBy: userId,
            });

            const res = await request(app)
                .patch(`/api/v1/product/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Modificado' });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Modificado');
        });

        it('debe devolver 404 si el producto no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .patch(`/api/v1/product/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'No existe' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Producto no encontrado');
        });
    });

    describe('DELETE /api/v1/product/:id', () => {
        it('debe eliminar un producto existente', async () => {
            const product = await Product.create({
                name: 'Para borrar',
                createdBy: userId,
            });

            const res = await request(app)
                .delete(`/api/v1/product/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Producto eliminado correctamente');
        });

        it('debe devolver 404 si el producto no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/v1/product/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Producto no encontrado');
        });
    });

    describe('POST /api/v1/product/group', () => {
        it('debe agrupar productos correctamente', async () => {
            const mainProduct = await Product.create({
                name: 'Main',
                createdBy: userId,
            });
            const secondary = await Product.create({
                name: 'Secundario',
                createdBy: userId,
            });

            await TransactionDetail.create({
                product: secondary._id,
                unitPrice: 1,
                transaction: new mongoose.Types.ObjectId(),
            });

            const res = await request(app)
                .post('/api/v1/product/group')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    mainId: mainProduct._id,
                    groupedIds: [mainProduct._id, secondary._id],
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Productos agrupados correctamente');

            const updatedDetail = await TransactionDetail.findOne({
                product: mainProduct._id,
            });
            expect(updatedDetail).not.toBeNull();
        });

        it('debe devolver 400 si solo se agrupa el principal', async () => {
            const product = await Product.create({
                name: 'Único',
                createdBy: userId,
            });

            const res = await request(app)
                .post('/api/v1/product/group')
                .set('Authorization', `Bearer ${token}`)
                .send({ mainId: product._id, groupedIds: [product._id] });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(
                'No se puede agrupar solo el producto principal',
            );
        });
    });
});
