/* src/stores/ai.store.js */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { aiService } from '@/services/ai.service';

export const useAIStore = defineStore('ai', () => {
    // Estados de Diagnóstico
    const report = ref(null);
    const timestamp = ref(null);
    const loadingDiagnostic = ref(false);
    const errorDiagnostic = ref(null);

    // Estados del Chat Flotante
    const messages = ref([
        { role: 'assistant', content: '¡Hola! Soy tu asistente técnico del boilerplate. ¿En qué te puedo ayudar hoy?' }
    ]);
    const loadingChat = ref(false);
    const errorChat = ref(null);

    const fetchDiagnostic = async (forced = false) => {
        if (report.value && !forced) return;

        loadingDiagnostic.value = true;
        errorDiagnostic.value = null;

        try {
            const response = await aiService.getSystemDiagnostic();
            report.value = response.data;
            timestamp.value = new Date().toISOString();
        } catch (err) {
            errorDiagnostic.value = err.response?.data?.message || 'Error al conectar con el servicio de diagnóstico.';
            throw err;
        } finally {
            loadingDiagnostic.value = false;
        }
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Añadir mensaje del usuario localmente
        messages.value.push({ role: 'user', content: text });
        loadingChat.value = true;
        errorChat.value = null;

        try {
            const response = await aiService.askAssistant(text);
            messages.value.push({ role: 'assistant', content: response.data.reply });
        } catch (err) {
            errorChat.value = err.response?.data?.message || 'No he podido procesar tu respuesta.';
            messages.value.push({ role: 'assistant', content: 'Lo siento, ha ocurrido un error al comunicarme con el servidor de IA.' });
        } finally {
            loadingChat.value = false;
        }
    };

    return {
        report,
        timestamp,
        loadingDiagnostic,
        errorDiagnostic,
        fetchDiagnostic,
        messages,
        loadingChat,
        errorChat,
        sendMessage
    };
});