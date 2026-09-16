import api from '@/api/axios';

export const diagnosticService = {
    async getSystemDiagnostic() {
        const response = await api.get('/diagnostics/system');
        return response.data;
    }
};