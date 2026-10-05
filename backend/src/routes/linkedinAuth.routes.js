/* src/routes/linkedinAuth.routes.js */
const express = require('express');
const router = express.Router();
const { linkedinLogin } = require('../controllers/linkedinAuth.controller');
const { checkLinkedinAuthEnabled } = require('../middlewares/linkedinEnabled.middleware');

router.use(checkLinkedinAuthEnabled);

router.post('/linkedin', linkedinLogin);

module.exports = router;