const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateJWT, checkPermission, authorizeRoles } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');

// Todas las rutas de usuario requieren estar autenticado
router.use(authenticateJWT);

// Endpoints del Perfil Propio (/api/v1/users/profile, /api/v1/users/avatar)
router.put('/profile', userController.updateProfile);
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);
router.delete('/avatar', userController.deleteAvatar);

// Endpoints Administrativos de Usuarios
const createUserValidation = [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validate,
];

router.get('/', checkPermission('users:read'), userController.getUsers);
router.post('/', checkPermission('users:create'), createUserValidation, userController.createUser);
router.put('/:id', checkPermission('users:update'), userController.updateUser);
router.put('/:id/roles', authorizeRoles('SUPER_ADMIN'), userController.updateUserRoles);
router.delete('/:id', checkPermission('users:delete'), userController.deleteUser);

module.exports = router;  
