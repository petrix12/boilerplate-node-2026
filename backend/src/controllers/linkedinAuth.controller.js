/* src/controllers/linkedinAuth.controller.js */
const linkedinAuthService = require('../services/linkedinAuth.service');
const { getClientIp } = require('../utils/request.utils');
const prisma = require('../config/prisma');

const linkedinLogin = async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            return res.status(400).json({ status: 'fail', message: 'El accessToken de LinkedIn es obligatorio' });
        }

        const result = await linkedinAuthService.authenticateWithLinkedin(accessToken);

        // Registrar auditoría de éxito
        await prisma.auditLog.create({
            data: {
                action: 'LINKEDIN_LOGIN_SUCCESS',
                entity: 'Auth',
                entityId: String(result.user.id),
                ipAddress: getClientIp(req),
                user: { connect: { id: result.user.id } },
                details: JSON.stringify({ email: result.user.email })
            }
        });

        // Evaluamos si la característica de IA está activa en el entorno
        const isAiEnabled = !!process.env.AI_API_KEY && process.env.AI_API_KEY.trim() !== '';

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
            message: 'Inicio de sesión con LinkedIn exitoso',
            data: responseData
        });
    } catch (error) {
        console.error('Error en linkedinLogin:', error.message);
        return res.status(401).json({
            status: 'fail',
            message: error.message || 'Error al autenticar con LinkedIn'
        });
    }
};

module.exports = { linkedinLogin };