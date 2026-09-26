import api from '@/api/axios';

export const authService = {
    // Registrar un nuevo usuario público
    async register(credentials) {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    },

    // Iniciar sesión
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Iniciar sesión con Google
    async loginWithGoogle(idToken) {
        const response = await api.post('/auth/google', { idToken });
        return response.data;
    },

    // Obtener perfil autenticado actual
    async getMe() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Cerrar sesión
    async logout() {
        const response = await api.post('/auth/logout');
        return response.data;
    }
};