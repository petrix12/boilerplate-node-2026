const { prismaRaw } = require('../config/prisma');
const multer = require('multer');

const errorHandler = async (err, req, res, next) => {
    let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
    let message = err.message || 'Error interno del servidor';
    let errorCode = null;

    // 1. Detección y normalización de errores de Multer
    if (err instanceof multer.MulterError) {
        statusCode = 400;
        errorCode = err.code;

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'El archivo supera el tamaño máximo permitido (máx 2MB)';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = `El campo '${err.field}' no es válido para la carga del archivo`;
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Has excedido el número máximo de archivos permitidos';
                break;
            default:
                message = `Error en la carga: ${err.message}`;
        }
    }

    const logLevel = statusCode >= 500 ? 'ERROR' : 'WARN';
    console.error(`[SYSTEM ${logLevel}] ${req.method} ${req.originalUrl}:`, err);

    // 2. Registro en base de datos (System Log)
    try {
        await prismaRaw.systemLog.create({
            data: {
                level: logLevel,
                message: message,
                stackTrace: err.stack,
                path: req.originalUrl,
                method: req.method,
                statusCode: statusCode,
                userId: req.user?.id || null
            }
        });
        console.log('✅ Log de sistema registrado exitosamente en BD');
    } catch (dbErr) {
        console.error('⚠️ Falló al insertar el log en la BD:', dbErr.message);
    }

    // 3. Respuesta JSON al cliente
    const responsePayload = {
        status: statusCode >= 500 ? 'error' : 'fail',
        message: statusCode === 500 ? 'Ha ocurrido un error inesperado en el servidor' : message
    };

    if (errorCode) {
        responsePayload.code = errorCode;
    }

    return res.status(statusCode).json(responsePayload);
};

module.exports = { errorHandler };