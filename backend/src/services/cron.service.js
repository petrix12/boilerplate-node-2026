const prisma = require('../config/prisma');

const cleanupOldLogs = async () => {
    try {
        const retentionDays = parseInt(process.env.LOG_RETENTION_DAYS, 10) || 30;
        
        // Calcular fecha límite
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - retentionDays);

        const result = await prisma.systemLog.deleteMany({
            where: {
                createdAt: {
                    lt: limitDate,
                },
            },
        });

        if (result.count > 0) {
            console.log(`[CLEANUP CRON]: Se eliminaron ${result.count} logs antiguos con más de ${retentionDays} días.`);
        }
    } catch (error) {
        console.error('[CLEANUP CRON ERROR]: Error al purgar logs antiguos:', error.message);
    }
};

const initSystemCleanup = () => {
    // Ejecutar una vez al arrancar el servidor (opcional)
    cleanupOldLogs();

    // Programar la ejecución cada 24 horas (24 * 60 * 60 * 1000 ms)
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    setInterval(cleanupOldLogs, TWENTY_FOUR_HOURS);

    console.log('[CLEANUP CRON]: Servicio de purga automática de logs inicializado.');
};

module.exports = { initSystemCleanup, cleanupOldLogs };