import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Pruebas de integración del Servidor y Rutas Base', () => {
    it('Debe responder con un 404 ante una ruta inexistente', async () => {
        const response = await request(app).get('/api/v1/ruta-que-no-existe');
        expect(response.status).toBe(404);
    });
});