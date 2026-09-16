const diagnosticAggregatorService = require('./diagnosticAggregator.service');

const aiService = {
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

        // Inyectamos la infraestructura real declarada por entorno para evitar alucinaciones del LLM
        rawData.environment = process.env.NODE_ENV || 'development';
        rawData.infrastructure = process.env.APP_INFRASTRUCTURE || 'Servidor Node.js nativo genérico';

        // 2. Construir el prompt de sistema y usuario
        const systemPrompt = `
            Eres un Arquitecto de Software Senior y Especialista en DevOps y Ciberseguridad. 
            Tu objetivo es analizar los datos de diagnóstico y auditoría de una aplicación web (Node.js, Express, PostgreSQL, Vue 3) y emitir un informe técnico claro, profesional y directo en formato JSON estrictamente válido.
            
            REGLA CRÍTICA DE INFRAESTRUCTURA:
            - Debes respetar estrictamente el campo "infrastructure" proporcionado en los datos de entrada (por ejemplo, si indica VPS Linux, PM2, systemd, etc., NO menciones Docker ni Kubernetes a menos que se indique explícitamente ahí). No inventes tecnologías de despliegue que no aparezcan en el contexto.

            Debes evaluar:
            - Estado del backend.
            - Estado del frontend.
            - Estado de la base de datos.
            - Estado global de la aplicación.
            - Estado de seguridad (analizando auditorías e intentos sospechosos).
            - Recomendaciones prácticas (comandos de consola, optimizaciones de BD, parches de seguridad).

            Responde ÚNICAMENTE con un objeto JSON válido que contenga la siguiente estructura exacta:
            {
                "backendStatus": "healthy | warning | critical",
                "frontendStatus": "healthy | warning | critical",
                "databaseStatus": "healthy | warning | critical",
                "globalStatus": "healthy | warning | critical",
                "securityStatus": "secure | suspicious | compromised",
                "summary": "Resumen ejecutivo breve en lenguaje humano",
                "details": {
                    "backend": "Análisis detallado del backend...",
                    "frontend": "Análisis detallado del frontend...",
                    "database": "Análisis detallado de la base de datos...",
                    "security": "Análisis detallado de seguridad y auditoría..."
                },
                "recommendations": [
                    "Acción 1 recomendada...",
                    "Acción 2 recomendada..."
                ]
            }
        `;

        const userPayload = JSON.stringify(rawData, null, 2);

        // 3. Seleccionar proveedor y ejecutar petición (Patrón Strategy / Adaptador)
        if (provider === 'groq') {
            return await this._callGroqAPI(apiKey, model, systemPrompt, userPayload);
        } else {
            throw new Error(`El proveedor de IA '${provider}' no está soportado actualmente.`);
        }
    },

    /**
     * Adaptador específico para Groq Cloud usando Fetch nativo
     */
    async _callGroqAPI(apiKey, model, systemPrompt, userPayload) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Analiza los siguientes datos del sistema:\n${userPayload}` }
                    ],
                    response_format: { type: 'json_object' }, // Forzar respuesta JSON limpia
                    temperature: 0.2, // Baja temperatura para análisis técnico objetivo
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error en API de Groq (${response.status}): ${errorData}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            return JSON.parse(content);
        } catch (error) {
            console.error('[AI SERVICE ERROR]:', error.message);
            throw new Error(`Fallo al generar el diagnóstico con IA: ${error.message}`);
        }
    },
};

module.exports = aiService;