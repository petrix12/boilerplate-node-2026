import { defineStore } from 'pinia';
import { authService } from '@/services/auth.service';

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

        userPermissions: (state) => {
            if (!state.user) return [];
            if (Array.isArray(state.user.permissions)) {
                return state.user.permissions;
            }
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

        hasPermission() {
            return (permission) => {
                if (!this.user) return false;
                const roles = Array.isArray(this.user.roles)
                    ? this.user.roles.map((r) => (typeof r === 'object' ? r.name : r))
                    : [];

                if (roles.includes('SUPER_ADMIN')) return true;
                return this.userPermissions.includes(permission);
            };
        },

        aiDiagnosticActive: (state) => !!state.user?.aiDiagnostic,
    },

    actions: {
        // 1. Iniciar Sesión Tradicional
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const res = await authService.login(credentials);
                const data = res.data || res; // Soporta tanto si viene envuelto en .data como plano
                
                this.token = data.token;
                this.user = {
                    ...data.user,
                    ...(data.features || {})
                };
                localStorage.setItem('token', data.token);

                return res;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al iniciar sesión';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // 1.1 Iniciar Sesión con Google
        async loginWithGoogle(idToken) {
            this.loading = true;
            this.error = null;
            try {
                const res = await authService.loginWithGoogle(idToken);
                const data = res.data || res;

                this.token = data.token;
                this.user = {
                    ...data.user,
                    ...(data.features || {})
                };
                localStorage.setItem('token', data.token);

                // Retornamos el objeto completo para que el componente lea 'isNewUser'
                return res;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error en la autenticación con Google';
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
                const res = await authService.register(userData);
                const data = res.data || res;

                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('token', data.token);

                return res;
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
                const res = await authService.getMe();
                const responseData = res.data || res;
                const user = responseData.user || responseData;
                const features = responseData.features || {};

                this.user = {
                    ...user,
                    ...features
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
                    await authService.logout();
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