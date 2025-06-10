import request from 'supertest';
import app from '../index';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { createTestUserAndToken } from './utils/testAuthHelper';
import { Ticket } from '../models/ticket.model';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let token: string;

beforeEach(async () => {
    const result = await createTestUserAndToken();
    token = result.token;
});

afterEach(async () => {
    await Ticket.deleteMany({});
});

describe('POST /api/v1/ticket (imagen)', () => {
    it('debe procesar correctamente una imagen con mocks', async () => {
        const imagePath = path.resolve(__dirname, 'assets', 'ticket.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        mockedAxios.post.mockImplementation((url, data) => {
            if (url.includes('/ocr')) {
                return Promise.resolve({
                    data: {
                        text: 'Texto extraído del ticket',
                        confidence: 98,
                    },
                });
            }

            if (url.includes('/parse')) {
                return Promise.resolve({
                    data: {
                        supermercado: 'SuperTest',
                        direccion: 'Calle Falsa 123',
                        fecha: '10/06/2024',
                        total_ticket: 23.5,
                        items: [
                            {
                                descripcion: 'Pan',
                                cantidad: 1,
                                precio_unitario: 1.5,
                                importe: 1.5,
                            },
                        ],
                    },
                });
            }

            return Promise.reject(new Error('URL no reconocida'));
        });

        const res = await request(app)
            .post('/api/v1/ticket/scan')
            .set('Authorization', `Bearer ${token}`)
            .attach('ticket', imagePath);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Ticket procesado/i);
        expect(res.body.resultado.supermercado).toBe('SuperTest');
    });
});
