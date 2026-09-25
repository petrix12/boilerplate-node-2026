require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// Inicialización del Servidor
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en ${APP_URL}`);
    console.log(`📌 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Inicializar el Servicio de Limpieza de Logs Antiguos
const { initSystemCleanup } = require('./services/cron.service');
initSystemCleanup();

// Cierre Limpio (Graceful Shutdown) para liberar el puerto
const gracefulShutdown = (signal) => {
    console.log(`\nRecibida señal ${signal}. Cerrando servidor limpiamente...`);
    server.close(() => {
        console.log('Servidor Express cerrado. Puerto liberado.');
        process.exit(0);
    });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));