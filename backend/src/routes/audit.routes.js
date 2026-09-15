const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/audit.controller');
const { authenticateJWT, checkPermission } = require('../middlewares/auth.middleware');

router.use(authenticateJWT);

// Permite el acceso a cualquiera que posea el permiso audit:read
router.get('/', checkPermission('audit:read'), getAuditLogs);

module.exports = router;