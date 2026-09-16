const express = require('express');
const router = express.Router();
const { getSystemDiagnostic } = require('../controllers/diagnostic.controller');
const { authenticateJWT, checkPermission } = require('../middlewares/auth.middleware'); // O tu middleware de permisos correspondiente

// Protegido con JWT y opcionalmente permisos de sistema/admin
router.use(authenticateJWT);

// GET /api/v1/diagnostics/system
router.get('/system', getSystemDiagnostic);

// O si usas control de permisos estricto:
// router.get('/system', checkPermission('system:read'), getSystemDiagnostic);

module.exports = router;