import api from '@/api/axios';

export const userService = {
    // --- Perfil propio ---
    async updateProfile(profileData) {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    },

    async uploadAvatar(formData) {
        // Dejar que Axios construya el multipart boundary
        const response = await api.post('/users/avatar', formData);
        return response.data;
    },

    async deleteAvatar() {
        const response = await api.delete('/users/avatar');
        return response.data;
    },

    // --- Endpoints Administrativos de Usuarios ---
    async getUsers(params = {}) {
        const response = await api.get('/users', { params });
        return response.data;
    },

    async createUser(userData) {
        const response = await api.post('/users', userData);
        return response.data;
    },

    async updateUser(userId, userData) {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },

    async updateUserRoles(userId, roles) {
        const response = await api.put(`/users/${userId}/roles`, { roles });
        return response.data;
    },

    async deleteUser(userId) {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    // --- Operaciones Administrativas de Avatar por ID ---
    async uploadUserAvatarById(userId, formData) {
        const response = await api.post(`/users/${userId}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deleteUserAvatarById(userId) {
        const response = await api.delete(`/users/${userId}/avatar`);
        return response.data;
    }    
};