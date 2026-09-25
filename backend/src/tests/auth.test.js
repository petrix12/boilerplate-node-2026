import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma.js';

describe('Pruebas de Integración - Módulo de Autenticación (/api/v1/auth)', () => {

    // Limpieza previa antes de cada prueba individual
    beforeEach(async () => {
        await prisma.user.deleteMany({
            where: { email: { contains: 'test_auth_' } }
        });
    });

    describe('1. POST /api/v1/auth/register', () => {
        it('Debe fallar (400) si faltan campos obligatorios o el email es inválido', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'correo-invalido',
                    password: '123',
                    firstName: '',
                    lastName: ''
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('Debe registrar un usuario exitosamente (201 o 200) con datos válidos', async () => {
            const uniqueEmail = `test_auth_${Date.now()}@example.com`;
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: uniqueEmail,
                    password: 'password123',
                    firstName: 'Pedro',
                    lastName: 'Bazó'
                });

            expect([200, 201]).toContain(response.status);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.data.user.email).toBe(uniqueEmail);
        });
    });

    describe('2. POST /api/v1/auth/login', () => {
        const loginUser = {
            email: `test_auth_login_${Date.now()}@example.com`,
            password: 'password123',
            firstName: 'Pedro',
            lastName: 'Bazó'
        };

        beforeEach(async () => {
            await request(app).post('/api/v1/auth/register').send(loginUser);
        });

        it('Debe fallar (400/401) si las credenciales son incorrectas o faltan campos', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: loginUser.email,
                    password: 'password-incorrecto'
                });

            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.body).toHaveProperty('status', 'fail');
        });

        it('Debe iniciar sesión exitosamente (200) y retornar un token JWT válido', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: loginUser.email,
                    password: loginUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.data).toHaveProperty('token');
        });
    });

    describe('3. Rutas Protegidas (GET /me y POST /logout)', () => {
        let validToken = '';
        const protectedUser = {
            email: `test_auth_prot_${Date.now()}@example.com`,
            password: 'password123',
            firstName: 'Pedro',
            lastName: 'Bazó'
        };

        // Preparamos un usuario y su token fresco exclusivamente para este bloque de pruebas
        beforeEach(async () => {
            await request(app).post('/api/v1/auth/register').send(protectedUser);
            const loginRes = await request(app).post('/api/v1/auth/login').send({
                email: protectedUser.email,
                password: protectedUser.password
            });
            validToken = loginRes.body.data.token;
        });

        it('Debe denegar el acceso (401) a /me si no se provee un token JWT', async () => {
            const response = await request(app).get('/api/v1/auth/me');
            expect(response.status).toBe(401);
        });

        it('Debe permitir acceder (200) a /me si se provee un token JWT válido', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.user).toHaveProperty('email', protectedUser.email);
        });

        it('Debe denegar el cierre de sesión (401) si no se provee un token JWT', async () => {
            const response = await request(app).post('/api/v1/auth/logout');
            expect(response.status).toBe(401);
        });

        it('Debe cerrar sesión exitosamente (200) con un token JWT válido', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
        });
    });
});