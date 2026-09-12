const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const registerValidation = [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
    validate,
];

const loginValidation = [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validate,
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticateJWT, getMe);
router.post('/logout', authenticateJWT, logout);

module.exports = router;