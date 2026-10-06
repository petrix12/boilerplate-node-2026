/* src/routes/instagramAuth.routes.js */
const express = require('express');
const router = express.Router();
const { instagramLogin } = require('../controllers/instagramAuth.controller');
const { checkInstagramAuthEnabled } = require('../middlewares/instagramEnabled.middleware');

// Aplicar el middleware de verificación a todas las rutas de este archivo
router.use(checkInstagramAuthEnabled);

router.post('/instagram', instagramLogin);

module.exports = router;