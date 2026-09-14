import api from '@/api/axios';

export const auditService = {
    async getAuditLogs(params = {}) {
        const response = await api.get('/audit-logs', { params });
        return response.data;
    }
};