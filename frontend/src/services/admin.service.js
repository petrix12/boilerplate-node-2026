import api from '@/api/axios';

export const adminService = {
    // Listar usuarios con búsqueda y paginación
    async getUsers(params = {}) {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Crear un nuevo usuario
    async createUser(userData) {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Actualizar datos de usuario
    async updateUser(userId, userData) {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },

    // Actualizar roles asignados
    async updateUserRoles(userId, roles) {
        const response = await api.put(`/users/${userId}/roles`, { roles });
        return response.data;
    },

    // Eliminar usuario de la plataforma
    async deleteUser(userId) {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    // Consultar los logs de auditoría
    async getAuditLogs(params = {}) {
        const response = await api.get('/audit-logs', { params });
        return response.data;
    }
};