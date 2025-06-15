import request from 'supertest';
import app from '../index';
import { INotification, Notification } from '../models/notification.model';
import mongoose from 'mongoose';
import { createTestUserAndToken } from './utils/testAuthHelper';
import { IUser } from '../models/user.model';

let token: string;
let user: IUser;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
    user = result.user;
});

describe('Notification Endpoints', () => {
    describe('GET /api/v1/notifications', () => {
        it('debe devolver notificaciones del usuario autenticado', async () => {
            await Notification.create([
                {
                    user: user._id,
                    message: 'Test 1',
                    status: 'pending',
                    type: 'alert',
                },
                {
                    user: user._id,
                    message: 'Test 2',
                    status: 'read',
                    type: 'alert',
                },
                {
                    user: user._id,
                    message: 'Archivada',
                    status: 'archived',
                    type: 'alert',
                },
            ]);

            const res = await request(app)
                .get('/api/v1/notifications')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
            expect(
                res.body.every((n: INotification) => n.status !== 'archived'),
            ).toBe(true);
        });
    });

    describe('PATCH /api/v1/notifications/:id', () => {
        it('debe actualizar el estado de una notificación existente', async () => {
            const noti = await Notification.create({
                user: user._id,
                message: 'Actualizar esto',
                status: 'pending',
                type: 'alert',
            });

            const res = await request(app)
                .patch(`/api/v1/notifications/${noti._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'read' });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('read');
        });

        it('debe devolver 400 si el ID no es válido', async () => {
            const res = await request(app)
                .patch('/api/v1/notifications/invalid-id')
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'read' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('ID de notificación no válido');
        });

        it('debe devolver 404 si la notificación no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .patch(`/api/v1/notifications/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'read' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Notificación no encontrada');
        });
    });
});
