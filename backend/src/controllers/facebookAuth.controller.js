/* src/controllers/facebookAuth.controller.js */
const facebookAuthService = require('../services/facebookAuth.service');
const { getClientIp } = require('../utils/request.utils');
const prisma = require('../config/prisma');

const facebookLogin = async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            return res.status(400).json({ status: 'fail', message: 'El accessToken de Facebook es obligatorio' });
        }

        const result = await facebookAuthService.authenticateWithFacebook(accessToken);

        // Registrar auditoría de éxito
        await prisma.auditLog.create({
            data: {
                action: 'FACEBOOK_LOGIN_SUCCESS',
                entity: 'Auth',
                entityId: String(result.user.id),
                ipAddress: getClientIp(req),
                user: { connect: { id: result.user.id } },
                details: JSON.stringify({ email: result.user.email })
            }
        });

        // Evaluamos si la característica de IA está activa en el entorno
        const isAiEnabled = !!process.env.AI_API_KEY && process.env.AI_API_KEY.trim() !== '';

        // Estructuramos la respuesta asegurando el bloque features al mismo nivel
        const responseData = {
            user: result.user,
            token: result.token,
            features: {
                aiDiagnostic: isAiEnabled
            }
        };

        if (result.isNewUser !== undefined) {
            responseData.isNewUser = result.isNewUser;
        }

        return res.status(200).json({
            status: 'success',
            message: 'Inicio de sesión con Facebook exitoso',
            data: responseData
        });
    } catch (error) {
        console.error('Error en facebookLogin:', error.message);
        return res.status(401).json({
            status: 'fail',
            message: error.message || 'Error al autenticar con Facebook'
        });
    }
};

module.exports = { facebookLogin };