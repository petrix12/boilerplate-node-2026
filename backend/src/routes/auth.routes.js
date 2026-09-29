/* src/routes/auth.routes.js */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, verifyEmail, login, getMe, logout, forgotPassword, resetPassword } = require('../controllers/auth.controller');
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

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    validate,
];

const resetPasswordValidation = [
    body('token').notEmpty().withMessage('El token es obligatorio'),
    body('newPassword').isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
    validate,
];

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Rutas protegidas
router.get('/me', authenticateJWT, getMe);
router.post('/logout', authenticateJWT, logout);

module.exports = router;