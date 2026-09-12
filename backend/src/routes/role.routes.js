const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { authenticateJWT, checkPermission } = require('../middlewares/auth.middleware');

router.use(authenticateJWT);

router.get('/', checkPermission('roles:read'), roleController.getRoles);
router.get('/permissions', checkPermission('roles:read'), roleController.getPermissions);
router.post('/', checkPermission('roles:create'), roleController.createRole);
router.put('/:id', checkPermission('roles:update'), roleController.updateRole);
router.delete('/:id', checkPermission('roles:delete'), roleController.deleteRole);

module.exports = router;