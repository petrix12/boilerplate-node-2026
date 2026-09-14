import api from '@/api/axios';

export const roleService = {
    async getRoles() {
        const response = await api.get('/roles');
        return response.data;
    },

    async getPermissions() {
        const response = await api.get('/roles/permissions');
        return response.data;
    },

    async createRole(roleData) {
        const response = await api.post('/roles', roleData);
        return response.data;
    },

    async updateRole(roleId, roleData) {
        const response = await api.put(`/roles/${roleId}`, roleData);
        return response.data;
    },

    async deleteRole(roleId) {
        const response = await api.delete(`/roles/${roleId}`);
        return response.data;
    }
};