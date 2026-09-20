// backend/src/routes/googleAuth.routes.js
const express = require('express');
const router = express.Router();
const { googleLogin } = require('../controllers/googleAuth.controller');
const { checkGoogleAuthEnabled } = require('../middlewares/googleEnabled.middleware');

// Validar que las funciones middleware estén definidas y no sean undefined
router.use(checkGoogleAuthEnabled);

router.post('/google', googleLogin);

module.exports = router;