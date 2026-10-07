/* src/routes/index.js */
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const googleAuthRoutes = require('./googleAuth.routes');
const facebookAuthRoutes = require('./facebookAuth.routes');
const linkedinAuthRoutes = require('./linkedinAuth.routes');
const instagramAuthRoutes = require('./instagramAuth.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const auditRoutes = require('./audit.routes');
const systemRoutes = require('./systemLog.routes');
const aiRoutes = require('./ai.routes');
const contactRoutes = require('./contact.routes');

router.use('/auth', authRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/auth', facebookAuthRoutes);
router.use('/auth', linkedinAuthRoutes);
router.use('/auth', instagramAuthRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/system-logs', systemRoutes);
router.use('/ai', aiRoutes);
router.use('/contact', contactRoutes);

module.exports = router;