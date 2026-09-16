const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Middleware para establecer el contexto de auditoría
const { setAuditUser } = require('./middlewares/auditContext.middleware');
// Middleware para manejo global de errores de sistema
const { errorHandler } = require('./middlewares/error.middleware');

// Rutas
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// Middlewares Globales
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_LOCAL_VITE,
    process.env.FRONTEND_URL_LOCAL_VUE_CLI,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // 1. En entorno de desarrollo permitimos cualquier petición para facilitar las pruebas
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        // 2. En producción o staging se valida estrictamente contra allowedOrigins
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error('No permitido por CORS'));
    },
    credentials: true
}));

app.use(express.json());

// Contexto de auditoría global para envolver la petición HTTP
app.use(setAuditUser);

// Ruta raíz informativa
app.get('/', (req, res) => {
    res.send('API REST de Boilerplate-Node-2026 ejecutándose. Visita /api/v1/health para estado.');
});

// Ruta de comprobación de estado (Health Check)
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API Boilerplate-Node-2026 operativa',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// Registrar Rutas de la API
app.use('/api/v1', routes);

// --- MANEJO DE ERRORES GLOBALES (Debe ser el último app.use) ---
app.use(errorHandler);

// --- CAPTURA DE ERRORES FUERA DEL CICLO HTTP ---
process.on('unhandledRejection', (reason) => {
    console.error('🔥 [CRITICAL] Promesa no capturada (unhandledRejection):', reason);
});

process.on('uncaughtException', (error) => {
    console.error('🔥 [CRITICAL] Excepción no controlada (uncaughtException):', error);
});

// Inicialización del Servidor (Asignado a constante server)
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en ${APP_URL}`);
    console.log(`📌 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Inicializar el Servicio de Limpieza de Logs Antiguos
const { initSystemCleanup } = require('./services/cron.service');
initSystemCleanup();

// Cierre Limpio (Graceful Shutdown)
const gracefulShutdown = (signal) => {
    console.log(`\nRecibida señal ${signal}. Cerrando servidor limpiamente...`);
    server.close(() => {
        console.log('Servidor Express cerrado. Puerto liberado.');
        process.exit(0);
    });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));