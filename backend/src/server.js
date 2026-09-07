require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en ${APP_URL}`);
});

// Cierre limpio del servidor para liberar el puerto
const gracefulShutdown = (signal) => {
    console.log(`\nRecibida señal ${signal}. Cerrando servidor limpiamente...`);
    server.close(() => {
        console.log('Servidor Express cerrado. Puerto liberado.');
        process.exit(0);
    });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));