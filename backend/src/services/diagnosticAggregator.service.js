const prisma = require('../config/prisma');

const diagnosticAggregatorService = {
    /**
     * Recopila y resume los datos clave del sistema para la IA
     */
    async getSystemDiagnosticData() {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // 1. Conteo de logs de sistema (últimas 24h) agrupados por fuente y nivel
            const systemLogsSummary = await prisma.systemLog.groupBy({
                by: ['source', 'level'],
                where: {
                    createdAt: { gte: twentyFourHoursAgo }
                },
                    _count: {
                    id: true
                }
            });

            // 2. Obtener los últimos 10 errores más críticos o recientes del sistema
            const recentErrors = await prisma.systemLog.findMany({
                where: {
                    createdAt: { gte: twentyFourHoursAgo }
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: {
                    source: true,
                    level: true,
                    message: true,
                    path: true,
                    statusCode: true,
                    createdAt: true
                }
            });

            // 3. Resumen de auditoría de seguridad (Intentos de login, accesos, etc. últimas 24h)
            const auditLogsSummary = await prisma.auditLog.groupBy({
                by: ['action', 'entity'],
                where: {
                    createdAt: { gte: twentyFourHoursAgo }
                },
                _count: {
                    id: true
                },
                orderBy: {
                    _count: { id: 'desc' }
                },
                take: 5
            });

            // 4. Métricas generales del servidor y DB
            const dbStatus = 'Connected'; // Si llegó aquí, la BD responde
            const totalUsers = await prisma.user.count();
            const activeUsers = await prisma.user.count({ where: { isActive: true } });

            return {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                infrastructure: {
                    backend: 'Node.js / Express (Docker)',
                    database: `PostgreSQL (${dbStatus})`,
                    frontend: 'Vite / Vue / SPA'
                },
                metrics: {
                    totalUsers,
                    activeUsers
                },
                systemLogsSummary,
                recentErrors,
                auditLogsSummary
            };
        } catch (error) {
            console.error('[DIAGNOSTIC AGGREGATOR ERROR]:', error.message);
            throw new Error('No se pudo recopilar el diagnóstico del sistema');
        }
    }
};

module.exports = diagnosticAggregatorService;