const express = require('express');
const router = express.Router();
const { ingestFrontendLog } = require('../controllers/systemLog.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

// Ingesta pública o semi-protegida para errores del cliente
// Nota: Usamos un middleware opcional o authenticateJWT según si permites logs de usuarios no autenticados.
router.post('/ingest', ingestFrontendLog);

module.exports = router;