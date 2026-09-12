const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/audit.controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(authenticateJWT);
router.get('/', authorizeRoles('SUPER_ADMIN'), getAuditLogs);

module.exports = router;