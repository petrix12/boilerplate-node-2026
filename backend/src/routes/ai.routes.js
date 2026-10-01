const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

// Todas las rutas de IA requieren autenticación previa
router.use(authenticateJWT);

// GET /api/v1/ai/diagnostic
router.get('/diagnostic', aiController.getSystemDiagnostic);

// POST /api/v1/ai/chat
router.post('/chat', aiController.handleChatQuery);

module.exports = router;