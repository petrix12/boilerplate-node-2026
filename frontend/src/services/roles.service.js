import api from '@/api/axios';

export const rolesService = {
    async getRoles() {
        const response = await api.get('/api/v1/roles');
        return response.data;
    },

    async getPermissions() {
        const response = await api.get('/api/v1/roles/permissions');
        return response.data;
    },

    async createRole(roleData) {
        const response = await api.post('/api/v1/roles', roleData);
        return response.data;
    },

    async updateRole(roleId, roleData) {
        const response = await api.put(`/api/v1/roles/${roleId}`, roleData);
        return response.data;
    },

    async deleteRole(roleId) {
        const response = await api.delete(`/api/v1/roles/${roleId}`);
        return response.data;
    }
};