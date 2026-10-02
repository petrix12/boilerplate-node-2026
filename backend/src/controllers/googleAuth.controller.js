/* src/controllers/googleAuth.controller.js */
const googleAuthService = require('../services/googleAuth.service');
const { getClientIp } = require('../utils/request.utils');
const prisma = require('../config/prisma');

const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ status: 'fail', message: 'El idToken de Google es obligatorio' });
        }

        const result = await googleAuthService.authenticateWithGoogle(idToken);

        // Registrar auditoría de éxito
        await prisma.auditLog.create({
            data: {
                action: 'GOOGLE_LOGIN_SUCCESS',
                entity: 'Auth',
                entityId: String(result.user.id),
                ipAddress: getClientIp(req),
                user: { connect: { id: result.user.id } },
                details: JSON.stringify({ email: result.user.email })
            }
        });

        // Evaluamos si la característica de IA está activa en el entorno
        const isAiEnabled = !!process.env.AI_API_KEY && process.env.AI_API_KEY.trim() !== '';

        // Estructuramos la respuesta asegurando el bloque features al mismo nivel que user y token,
        // respetando lo que devuelva result (por si incluye isNewUser u otras propiedades)
        const responseData = {
            user: result.user,
            token: result.token,
            features: {
                aiDiagnostic: isAiEnabled
            }
        };

        // Si result tenía más propiedades (como isNewUser), las conservamos
        if (result.isNewUser !== undefined) {
            responseData.isNewUser = result.isNewUser;
        }

        return res.status(200).json({
            status: 'success',
            message: 'Inicio de sesión con Google exitoso',
            data: responseData
        });
    } catch (error) {
        console.error('Error en googleLogin:', error.message);
        return res.status(401).json({
            status: 'fail',
            message: error.message || 'Error al autenticar con Google'
        });
    }
};

module.exports = { googleLogin };