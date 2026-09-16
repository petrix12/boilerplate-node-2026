const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const auditRoutes = require('./audit.routes');
const systemRoutes = require('./systemLog.routes');
const diagnosticRoutes = require('./diagnostic.routes');

// Definición limpia de módulos
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/system-logs', systemRoutes);
router.use('/diagnostics', diagnosticRoutes);

module.exports = router;