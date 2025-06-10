import request from 'supertest';
import path from 'path';
import app from '../index';
import { createTestUserAndToken } from './utils/testAuthHelper';

let token: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
});

describe('Profile Endpoints', () => {
    describe('PATCH /api/v1/profile/password', () => {
        it('debe actualizar la contraseña correctamente', async () => {
            const res = await request(app)
                .patch('/api/v1/profile/password')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'hashed',
                    newPassword: 'nuevaPass456',
                })
                .expect(200);

            expect(res.body.message).toMatch(/contraseña actualizada/i);
        });

        it('debe devolver 401 si la contraseña actual es incorrecta', async () => {
            const res = await request(app)
                .patch('/api/v1/profile/password')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'incorrecta',
                    newPassword: 'nuevaPass456',
                })
                .expect(401);

            expect(res.body.error).toMatch(/contraseña actual incorrecta/i);
        });

        it('debe devolver 400 si los datos no son válidos', async () => {
            const res = await request(app)
                .patch('/api/v1/profile/password')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: '',
                    newPassword: '123',
                })
                .expect(400);

            expect(res.body.error).toBeDefined();
        });
    });

    describe('PATCH /api/v1/profile', () => {
        it('debe actualizar el perfil correctamente', async () => {
            const res = await request(app)
                .patch('/api/v1/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'NuevoNombre',
                    surname: 'NuevosApellidos',
                    email: 'nuevo@correo.com',
                })
                .expect(200);

            expect(res.body.name).toBe('NuevoNombre');
            expect(res.body.email).toBe('nuevo@correo.com');
            expect(res.body.passwordHash).toBeUndefined();
        });

        it('debe devolver 400 si los datos no son válidos', async () => {
            const res = await request(app)
                .patch('/api/v1/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: '',
                    surname: '',
                    email: 'correo-invalido',
                })
                .expect(400);

            expect(res.body.error).toBeDefined();
        });
    });

    describe('PATCH /api/v1/profile/avatar', () => {
        it('debe actualizar el avatar correctamente', async () => {
            const imagePath = path.resolve(__dirname, 'assets', 'Avatar.jpg');

            const res = await request(app)
                .patch('/api/v1/profile/avatar')
                .set('Authorization', `Bearer ${token}`)
                .attach('avatar', imagePath)
                .expect(200);

            expect(res.body.avatarUrl).toMatch(/\/uploads\/avatars\/.+\.jpg$/);
        });

        it('debe devolver 400 si no se sube ningún archivo', async () => {
            const res = await request(app)
                .patch('/api/v1/profile/avatar')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);

            expect(res.body.error).toMatch(/no se envió ningún archivo/i);
        });
    });
});
