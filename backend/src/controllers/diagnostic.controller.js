const aiService = require('../services/ai.service');

const getSystemDiagnostic = async (req, res, next) => {
    try {
        const diagnosticReport = await aiService.generateSystemDiagnostic();

        return res.status(200).json({
            status: 'success',
            data: diagnosticReport,
        });
    } catch (error) {
        console.error('Error al generar diagnóstico del sistema:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error interno al generar el diagnóstico de IA',
        });
    }
};

module.exports = {
    getSystemDiagnostic,
};