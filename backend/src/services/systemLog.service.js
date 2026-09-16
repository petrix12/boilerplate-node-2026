const prisma = require('../config/prisma');

const systemLogService = {
    /**
     * Registra un error o advertencia en la tabla SystemLog
     */
    async log({
        source = 'BACKEND',
        level = 'ERROR',
        message,
        stackTrace = null,
        path = null,
        method = null,
        statusCode = 500,
        userId = null,
        context = null,
    }) {
        try {
            return await prisma.systemLog.create({
                data: {
                    source,
                    level,
                    message: message ? String(message) : 'Mensaje no especificado',
                    stackTrace: stackTrace ? String(stackTrace) : null,
                    path,
                    method,
                    statusCode: parseInt(statusCode, 10) || 500,
                    userId,
                    context: context ? context : undefined,
                },
            });
        } catch (error) {
            // Evitamos que un error guardando el log detenga la aplicación
            console.error('[SYSTEM LOG ERROR]: No se pudo guardar el log en DB:', error.message);
        }
    },
};

module.exports = systemLogService;