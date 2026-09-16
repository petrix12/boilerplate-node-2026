const systemLogService = require('../services/systemLog.service');

const ingestFrontendLog = async (req, res) => {
    try {
        const { level = 'ERROR', message, stackTrace, path, context } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'El mensaje del log es obligatorio' });
        }

        await systemLogService.log({
            source: 'FRONTEND',
            level,
            message,
            stackTrace,
            path,
            statusCode: null,
            userId: req.user?.id || null, // Opcional si la ruta pasa por auth
            context: {
                ...context,
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            },
        });

        return res.status(201).json({ status: 'success', message: 'Log registrado' });
    } catch (error) {
        console.error('Error al ingerir log de frontend:', error);
        return res.status(500).json({ message: 'Error interno al procesar el log' });
    }
};

module.exports = { ingestFrontendLog };