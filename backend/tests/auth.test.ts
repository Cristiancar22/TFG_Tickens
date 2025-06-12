import request from 'supertest';
import app from '../index';

describe('Auth Endpoints', () => {
    const userData = {
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        password: '123456',
    };

    it('debe registrar un nuevo usuario', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userData)
            .expect(201);

        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe(userData.email);
        expect(res.body.name).toBe(userData.name);
    });

    it('no debe registrar si el email ya está registrado', async () => {
        await request(app).post('/api/v1/auth/register').send(userData);

        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userData)
            .expect(400);

        expect(res.body.message).toMatch(/correo ya está registrado/i);
    });

    it('debe hacer login con credenciales correctas', async () => {
        await request(app).post('/api/v1/auth/register').send(userData);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: userData.email,
                password: userData.password,
            })
            .expect(200);

        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe(userData.email);
    });

    it('debe verificar el token y devolver los datos del usuario', async () => {
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send(userData)
            .expect(201);

        const token = registerRes.body.token;

        const res = await request(app)
            .get('/api/v1/auth/check-token')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.email).toBe(userData.email);
        expect(res.body).toHaveProperty('_id');
    });

    it('debe fallar login con contraseña incorrecta', async () => {
        await request(app).post('/api/v1/auth/register').send(userData);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: userData.email,
                password: 'wrongpassword',
            })
            .expect(401);

        expect(res.body.message).toMatch(/credenciales incorrectas/i);
    });
});
