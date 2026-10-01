const aiService = require('../services/ai.service');

const aiController = {
    /**
     * Obtiene el informe de diagnóstico técnico del sistema generado por IA
     */
    async getSystemDiagnostic(req, res, next) {
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
    },

    /**
     * Procesa las preguntas del chat del desarrollador sobre el boilerplate
     */
    async handleChatQuery(req, res, next) {
        try {
            const { message } = req.body;

            if (!message || typeof message !== 'string' || message.trim() === '') {
                return res.status(400).json({
                    status: 'error',
                    message: 'El campo "message" es obligatorio y debe ser un texto válido.',
                });
            }

            const reply = await aiService.askAssistant(message.trim());

            return res.status(200).json({
                status: 'success',
                data: {
                    reply,
                },
            });
        } catch (error) {
            console.error('Error en el chat de IA del boilerplate:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Error interno al procesar la consulta con la IA',
            });
        }
    },
};

module.exports = aiController;