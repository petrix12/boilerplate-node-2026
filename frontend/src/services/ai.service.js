/* src/services/ai.service.js */
import api from '@/api/axios';

export const aiService = {
    async getSystemDiagnostic() {
        const response = await api.get('/ai/diagnostic');
        return response.data;
    },

    async askAssistant(message) {
        const response = await api.post('/ai/chat', { message });
        return response.data;
    }
};