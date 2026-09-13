import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        userRoles: (state) => state.user?.roles || [],
    },

    actions: {
        // 1. Iniciar Sesión
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/login', credentials);
                // Verificación defensiva de la estructura
                const data = response.data?.data || response.data;
                
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('token', data.token);

                return response.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al iniciar sesión';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // 2. Registrar Usuario
        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/register', userData);
                const { user, token } = response.data.data;

                this.token = token;
                this.user = user;
                localStorage.setItem('token', token);

                return response.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al registrar usuario';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // 3. Verificar Sesión al recargar la página
        async fetchUser() {
            if (!this.token) return;

            this.loading = true;
            try {
                const response = await api.get('/auth/me');
                this.user = response.data.data.user;
            } catch (err) {
                console.error('Sesión expirada o token inválido:', err);
                this.logout();
            } finally {
                this.loading = false;
            }
        },

        // 4. Cerrar Sesión
        async logout() {
            try {
                if (this.token) {
                await api.post('/auth/logout');
                }
            } catch (err) {
                console.warn('Error respondiendo al servidor en logout:', err);
            } finally {
                this.user = null;
                this.token = null;
                localStorage.removeItem('token');
            }
        },
    },
});