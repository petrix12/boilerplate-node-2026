const fs = require('fs');
const path = require('path');
const diagnosticAggregatorService = require('./diagnosticAggregator.service');

const aiService = {
    /**
     * Carga un archivo Markdown desde la carpeta data de manera segura.
     */
    _loadMarkdownFile(filename) {
        try {
            const filePath = path.join(__dirname, `../data/${filename}`);
            return fs.readFileSync(filePath, 'utf-8');
        } catch (error) {
            console.error(`[AI SERVICE ERROR] No se pudo leer el archivo ${filename}:`, error.message);
            return '';
        }
    },

    /**
     * Genera el diagnóstico del sistema utilizando la IA configurada (Groq)
     */
    async generateSystemDiagnostic() {
        const provider = process.env.AI_PROVIDER || 'groq';
        const apiKey = process.env.AI_API_KEY;
        const model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

        if (!apiKey) {
            throw new Error('La clave de API de IA (AI_API_KEY) no está configurada en el entorno.');
        }

        // 1. Recopilar datos estructurados del agregador
        const rawData = await diagnosticAggregatorService.getSystemDiagnosticData();

        rawData.environment = process.env.APP_ENV || 'development';
        rawData.infrastructure = process.env.APP_INFRASTRUCTURE || 'Servidor Node.js nativo genérico';

        // 2. Cargar el prompt de sistema desde el archivo externo
        const systemPrompt = this._loadMarkdownFile('diagnostic-prompt.md');
        const userPayload = JSON.stringify(rawData, null, 2);

        // 3. Ejecutar petición pidiendo formato JSON
        if (provider === 'groq') {
            return await this._callGroqAPI(apiKey, model, systemPrompt, userPayload, true);
        } else {
            throw new Error(`El proveedor de IA '${provider}' no está soportado actualmente.`);
        }
    },

    /**
     * Asistente de chat para el boilerplate basado en el cerebro ai-context.md
     */
    async askAssistant(userMessage) {
        const provider = process.env.AI_PROVIDER || 'groq';
        const apiKey = process.env.AI_API_KEY;
        const model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

        if (!apiKey) {
            throw new Error('La clave de API de IA (AI_API_KEY) no está configurada en el entorno.');
        }

        // 1. Cargar el contexto general (cerebro) desde el archivo externo
        const systemContext = this._loadMarkdownFile('ai-context.md');
        const systemPrompt = `${systemContext}\n\nResponde de manera amable, técnica, profesional y directa a las consultas del desarrollador basándote estrictamente en la información anterior.`;

        // 2. Ejecutar petición esperando texto normal en Markdown
        if (provider === 'groq') {
            return await this._callGroqAPI(apiKey, model, systemPrompt, userMessage, false);
        } else {
            throw new Error(`El proveedor de IA '${provider}' no está soportado actualmente.`);
        }
    },

    /**
     * Adaptador centralizado para Groq Cloud usando Fetch nativo
     */
    async _callGroqAPI(apiKey, model, systemPrompt, userPayload, expectJson = false) {
        try {
            const bodyPayload = {
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: expectJson ? `Analiza los siguientes datos del sistema:\n${userPayload}` : userPayload }
                ],
                temperature: expectJson ? 0.2 : 0.3,
            };

            if (expectJson) {
                bodyPayload.response_format = { type: 'json_object' };
            }

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyPayload),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error en API de Groq (${response.status}): ${errorData}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            if (expectJson) {
                return JSON.parse(content);
            }
            return content || 'No he podido procesar una respuesta.';
        } catch (error) {
            console.error('[AI SERVICE ERROR]:', error.message);
            throw new Error(`Fallo al generar respuesta con IA: ${error.message}`);
        }
    },
};

module.exports = aiService;