/* src/routes/facebookAuth.routes.js */
const express = require('express');
const router = express.Router();
const { facebookLogin } = require('../controllers/facebookAuth.controller');
const { checkFacebookAuthEnabled } = require('../middlewares/facebookEnabled.middleware');

// Validar que las credenciales de Facebook estén habilitadas
router.use(checkFacebookAuthEnabled);

router.post('/facebook', facebookLogin);

module.exports = router;