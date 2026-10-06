/* src/controllers/instagramAuth.controller.js */
const instagramAuthService = require('../services/instagramAuth.service');
const { getClientIp } = require('../utils/request.utils');
const prisma = require('../config/prisma');

const instagramLogin = async (req, res) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({
                status: 'fail',
                message: 'El token de acceso de Instagram es obligatorio'
            });
        }

        const authResult = await instagramAuthService.authenticateWithInstagram(accessToken);

        const isAiEnabled = !!process.env.AI_API_KEY && process.env.AI_API_KEY.trim() !== '';

        // Registrar auditoría de éxito
        await prisma.auditLog.create({
            data: {
                action: 'LOGIN_SUCCESS_INSTAGRAM',
                entity: 'Auth',
                entityId: String(authResult.user.id),
                ipAddress: getClientIp(req),
                user: { connect: { id: authResult.user.id } },
                details: JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'] }),
            },
        });

        return res.status(200).json({
            status: 'success',
            message: 'Inicio de sesión con Instagram exitoso',
            data: {
                user: authResult.user,
                features: {
                    aiDiagnostic: isAiEnabled
                },
                token: authResult.token
            }
        });
    } catch (error) {
        console.error('Error en instagramLogin:', error.message);
        return res.status(401).json({
            status: 'fail',
            message: error.message || 'Error al autenticar con Instagram'
        });
    }
};

module.exports = { instagramLogin };