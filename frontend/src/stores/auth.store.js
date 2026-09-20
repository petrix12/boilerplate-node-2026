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

        // Devuelve la lista de permisos en formato de strings
        userPermissions: (state) => {
            if (!state.user) return [];

            // Si el backend envía el array plano de acciones ['read:users', 'write:users']
            if (Array.isArray(state.user.permissions)) {
                return state.user.permissions;
            }

            // Fallback por si en alguna vista la propiedad 'roles' viene con objetos completos
            if (Array.isArray(state.user.roles)) {
                const permissionsFromRoles = state.user.roles.flatMap((role) => {
                    if (typeof role === 'object' && Array.isArray(role.permissions)) {
                        return role.permissions.map((p) => (typeof p === 'object' ? p.action || p.name : p));
                    }
                    return [];
                });
                return [...new Set(permissionsFromRoles)];
            }

            return [];
        },

        // Retorna una función evaluadora utilizando 'this' para acceder al getter anterior
        hasPermission() {
            return (permission) => {
                if (!this.user) return false;

                // Normaliza roles (soporta array de strings o array de objetos)
                const roles = Array.isArray(this.user.roles)
                    ? this.user.roles.map((r) => (typeof r === 'object' ? r.name : r))
                    : [];

                // Bypass global para SUPER_ADMIN
                if (roles.includes('SUPER_ADMIN')) return true;

                // Comprueba la existencia del permiso usando el getter corregido
                return this.userPermissions.includes(permission);
            };
        },

        // Indica si la funcionalidad de diagnóstico por IA está activa según la respuesta del backend
        aiDiagnosticActive: (state) => !!state.user?.aiDiagnostic,
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
                this.user = {
                    ...data.user,
                    ...(data.features || {})
                };
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
                const { user, features } = response.data.data;
                this.user = {
                    ...user,
                    ...(features || {})
                };
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

const loginWithGoogle = async (idToken) => {
    try {
        const response = await axios.post('/auth/google', { idToken });
        const { token, user } = response.data.data;
        
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        
        // Configurar headers globales de axios si es necesario
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
        throw error.response?.data?.message || 'Error en la autenticación con Google';
    }
};