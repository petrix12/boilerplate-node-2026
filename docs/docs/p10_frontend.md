# 💻 Desarrollo del Frontend

## 🧹 Limpieza del proyecto Vue
1. Elimimar los siguientes archivos:
    + `frontend/src/assets/logo.svg`.
    + `frontend/src/components/icons/IconCommunity.vue`.
    + `frontend/src/components/icons/IconDocumentation.vue`.
    + `frontend/src/components/icons/IconEcosystem.vue`.
    + `frontend/src/components/icons/IconSupport.vue`.
    + `frontend/src/components/icons/IconTooling.vue`.
    + `frontend/src/components/HelloWorld.vue`.
    + `frontend/src/components/WelcomeItem.vue`.
    + `frontend/src/stores/counter.js`.
    + `frontend/src/views/AboutView.vue`.

## 👁️‍🗨️ Implementar el Protocolo Open Graph
1. Diseñar tu imagen Open Graph (`og:image`):
    + Las redes sociales (WhatsApp, LinkedIn, Twitter, etc.) exigen unas medidas estándar para que las previsualizaciones se vean perfectas y no salgan recortadas.
        + Medida ideal: `1200 x 630` píxeles.
        + Formato: PNG o JPG optimizado (pesando menos de 1 MB).
        + Dónde ubicarla: Coloca esta imagen dentro de tu carpeta `public/` en el proyecto (por ejemplo, `public/og-image.png`). De este modo, en producción estará accesible directamente en [https://tudominio.com/og-image.png](https://tudominio.com/og-image.png).
2. Configurar las etiquetas estáticas en `index.html`:
    + Abre tu archivo `frontend/index.html` en la raíz del proyecto. Vamos a estructurar la sección `<head>` para incluir tanto los metadatos generales como los bloques completos de Open Graph y Twitter Cards.
    + Reemplaza o adapta el contenido de tu `<head>` con esta estructura profesional:
        ```html
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            <!-- Título y descripción por defecto -->
            <title>Boilerplate Node.js | Vue.js 2026</title>
            <meta name="description" content="Plataforma moderna desarrollada con Vue, Node.js y arquitectura robusta." />

            <!-- ========================================== -->
            <!-- PROTOCOLOS OPEN GRAPH (Facebook, WhatsApp, LinkedIn) -->
            <!-- ========================================== -->
            <meta property="og:type" content="website" />
            <!-- IMPORTANTE: Cambia esta URL por la URL real de tu dominio en producción en Vercel -->
            <meta property="og:url" content="https://boilerplate-node-2026.vercel.app/" />
            <meta property="og:title" content="Boilerplate Node.js | Vue.js 2026" />
            <meta property="og:description" content="Plataforma moderna desarrollada con Vue, Node.js y arquitectura robusta." />
            <!-- IMPORTANTE: Usa siempre una URL absoluta para la imagen -->
            <meta property="og:image" content="https://boilerplate-node-2026.vercel.app/logo.png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="es_ES" />

            <!-- ========================================== -->
            <!-- TWITTER CARDS (Twitter / X) -->
            <!-- ========================================== -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content="https://boilerplate-node-2026.vercel.app/" />
            <meta name="twitter:title" content="Boilerplate Node.js | Vue.js 2026" />
            <meta name="twitter:description" content="Plataforma moderna desarrollada con Vue, Node.js y arquitectura robusta." />
            <meta name="twitter:image" content="https://boilerplate-node-2026.vercel.app/logo.png" />
        </head>        
        ```

## 📦 Instalación de Dependencias
1. Instalamos Axios para las peticiones HTTP y el plugin oficial de Tailwind CSS v4 para Vite entre otras:
    ```bash
     # Instalar cliente HTTP
    npm install axios

     # Instalar Tailwind CSS v4 y su integración con Vite
    npm install -D tailwindcss @tailwindcss/vite

     # Sweet Alert 2
    npm install sweetalert2

     # Hero icons for Vue.js
    npm install @heroicons/vue

     # Flatpickr
    npm install flatpickr
    ```
2. Reconstruir el contenedor:
    ```bash
    docker compose down
    docker compose build --no-cache frontend
    docker compose up -d
    ```

## 🎨 Inicialización de la Capa de Presentación
1. Configuración de Vite y Tailwind v4: 
    + Abre el archivo `frontend/vite.config.js` déjalo exactamente así:
        ```js
        import { fileURLToPath, URL } from 'node:url'
        import { defineConfig } from 'vite'
        import vue from '@vitejs/plugin-vue'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
            plugins: [
                vue(),
                tailwindcss(),
            ],
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url))
                }
            }
        })
        ```
    + Abre el archivo `frontend/src/assets/main.css`, déjalo exactamente así:
        ```css
        @import "tailwindcss";

        /* 1. Definimos los selectores de variante oscura para Tailwind v4 */
        @variant dark (&:where(.dark, .dark *));

        @theme {
            --color-app-bg: var(--bg-app);
            --color-app-surface: var(--surface-app);
            --color-app-text: var(--text-app);
        }

        /* 2. Paleta por defecto (Modo Claro) */
        :root {
            --bg-app: #f8fafc;       /* slate-50 */
            --surface-app: #ffffff;  /* blanco */
            --text-app: #0f172a;     /* slate-900 */
            --border-app: #e2e8f0;   /* slate-200 */
        }

        /* 3. Paleta para el Modo Oscuro */
        .dark {
            --bg-app: #0f172a;       /* slate-900 */
            --surface-app: #1e293b;  /* slate-800 */
            --text-app: #f8fafc;     /* slate-50 */
            --border-app: #334155; /* slate-700 */
        }

        /* Aplicación base reactiva */
        html,
        body,
        #app {
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0;
            padding: 0;
            background-color: var(--bg-app);
            color: var(--text-app);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* --- CURSOR POINTER GLOBAL --- */
        button,
        [role="button"],
        a,
        label[for],
        summary,
        select,
        input[type="checkbox"],
        input[type="radio"],
        input[type="submit"],
        input[type="button"] {
            cursor: pointer;
        }

        button:disabled,
        input:disabled,
        [disabled] {
            cursor: not-allowed;
        }
        ```
2. Cliente HTTP Centralizado (`src/api/axios.js`)
    + Crea el archivo `frontend/src/api/axios.js`:
        ```js
        import axios from 'axios';

        const api = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para inyectar automáticamente el Token Bearer si existe en localStorage
        api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        export default api;
        ```
2. Store de tema oscuro (`frontend/src/stores/theme.store.js`):
   ```js
    // src/stores/theme.store.js
    import { defineStore } from 'pinia';
    import { ref, watch } from 'vue';

    export const useThemeStore = defineStore('theme', () => {
        // Inicializar leyendo del localStorage o de las preferencias del sistema operativo
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const isDark = ref(savedTheme ? savedTheme === 'dark' : prefersDark);

        // Función para aplicar o quitar la clase 'dark' en la etiqueta <html>
        const applyTheme = (dark) => {
            if (dark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        // Aplicar al iniciar
        applyTheme(isDark.value);

        // Sancionar cambios y guardarlos en localStorage
        watch(isDark, (newValue) => {
            applyTheme(newValue);
            localStorage.setItem('theme', newValue ? 'dark' : 'light');
        });

        const toggleTheme = () => {
            isDark.value = !isDark.value;
        };

        return {
            isDark,
            toggleTheme,
        };
    });   
   ```
3. Store de Autenticación con Pinia (`frontend/src/stores/auth.store.js`)
    ```js
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
    ```
4. Store de Diagnóstico por IA con Pinia (`frontend/src/stores/diagnostic.store.js`):
    ```js
    import { defineStore } from 'pinia';
    import { ref } from 'vue';
    import { diagnosticService } from '@/services/diagnostic.service';

    export const useDiagnosticStore = defineStore('diagnostic', () => {
        const report = ref(null);
        const timestamp = ref(null);
        const loading = ref(false);
        const error = ref(null);

        const fetchDiagnostic = async (forced = false) => {
            // Si ya tenemos un reporte y no se fuerza la recarga, evitamos la llamada
            if (report.value && !forced) {
                return;
            }

            loading.value = true;
            error.value = null;

            try {
                const response = await diagnosticService.getSystemDiagnostic();
                report.value = response.data;
                timestamp.value = new Date().toISOString(); // Guardamos la fecha y hora exacta
            } catch (err) {
                error.value = err.response?.data?.message || 'Error al conectar con el servicio de diagnóstico.';
                throw err; // Opcional: relanzar para que la vista lo maneje si es necesario
            } finally {
                loading.value = false;
            }
        };

        return {
            report,
            timestamp,
            loading,
            error,
            fetchDiagnostic
        };
    });        
    ```
5. Configuración de Vue Router con Guards (`src/router/index.js`)
    + Abre o crea el archivo `frontend/src/router/index.js` y reemplaza su contenido:
        ```js
        /* src/router/index.js */
        import { createRouter, createWebHistory } from 'vue-router';
        import { useAuthStore } from '../stores/auth.store';

        const router = createRouter({
            history: createWebHistory(import.meta.env.BASE_URL),
            routes: [
                { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Inicio' } },
                { path: '/login', name: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { requiresGuest: true, title: 'Iniciar Sesión' } },
                { path: '/register', name: 'register', component: () => import('@/views/auth/RegisterView.vue'), meta: { requiresGuest: true, title: 'Registro' } },
                { path: '/verify-email', name: 'VerifyEmail', component: () => import('@/views/auth/VerifyEmailView.vue'), meta: { requiresGuest: true } },
                { path: '/forgot-password', name: 'forgot-password', component: () => import('@/views/auth/ForgotPasswordView.vue') },
                { path: '/reset-password', name: 'reset-password', component: () => import('@/views/auth/ResetPasswordView.vue') },
                {
                    // Rutas protegidas que comparten el mismo Navbar sin pestañeos
                    path: '/',
                    component: () => import('@/layouts/AppLayout.vue'),
                    meta: { requiresAuth: true },
                    children: [
                        {
                            path: 'dashboard',
                            name: 'dashboard',
                            component: () => import('@/views/DashboardView.vue'),
                            meta: { title: 'Dashboard' }
                        },
                        {
                            path: 'profile',
                            name: 'profile',
                            component: () => import('@/views/ProfileView.vue'),
                            meta: { title: 'Configuración de Perfil' }
                        },
                        { 
                            path: '/admin', 
                            name: 'admin-dashboard', 
                            component: () => import('@/views/admin/AdminDashboardView.vue'), 
                            meta: { title: 'Panel de Administración', requiresPermission: 'admin:access' } 
                        },
                        {
                            path: 'admin/users',
                            name: 'admin-users',
                            component: () => import('@/views/admin/UsersAdminView.vue'),
                            meta: { title: 'Gestión de Usuarios', requiresPermission: 'users:read' }
                        },
                        { 
                            path: '/admin/roles', 
                            name: 'admin-roles', 
                            component: () => import('@/views/admin/RolesAdminView.vue'), 
                            meta: { title: 'Roles y Permisos', requiresPermission: 'roles:read' } 
                        },
                        { 
                            path: '/admin/audit-logs', 
                            name: 'admin-audit-logs', 
                            component: () => import('@/views/admin/AuditLogsView.vue'), 
                            meta: { title: 'Registros de Auditoría', requiresPermission: 'audit:read' } 
                        },
                        {
                            path: '/admin/system-diagnostic',
                            name: 'SystemDiagnostic',
                            component: () => import('@/views/admin/SystemDiagnosticView.vue'),
                            meta: { title: 'Diagnóstico del Sistema', requiresAuth: true, requiresPermission: 'system:logs:read' }
                        }                
                    ]
                },               
                { path: '/403', name: 'forbidden', component: () => import('@/views/errors/ForbiddenView.vue'), meta: { requiresAuth: true, title: 'Acceso Denegado' } },
                { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/errors/NotFoundView.vue'), meta: { title: 'Página no encontrada' } },
            ],
        });

        // Navigation Guard Global
        router.beforeEach(async (to) => {
            const authStore = useAuthStore();

            // 1. Asignar título dinámico a la pestaña del navegador
            const appName = 'Boilerplate Node 2026';
            document.title = to.meta.title ? `${to.meta.title} | ${appName}` : appName;

            // Cargar perfil si hay token activo
            if (authStore.token && !authStore.user) {
                await authStore.fetchUser();
            }

            const isAuthenticated = authStore.isAuthenticated;

            // 2. Verificar si la ruta requiere autenticación
            if (to.meta.requiresAuth && !isAuthenticated) {
                return { name: 'login' };
            }

            // 3. Verificar rutas solo para invitados (Login/Register)
            if (to.meta.requiresGuest && isAuthenticated) {
                return { name: 'dashboard' };
            }

            // 4. Validación de Permisos (Redirige a 403 Forbidden)
            if (to.meta.requiresPermission) {
                if (!authStore.hasPermission(to.meta.requiresPermission)) {
                    return { name: 'forbidden' };
                }
            }

            // 5. Validación de Roles (Redirige a 403 Forbidden)
            if (to.meta.requiresRole) {
                const userRoles = authStore.userRoles;
                if (!userRoles.includes('SUPER_ADMIN') && !userRoles.includes(to.meta.requiresRole)) {
                    return { name: 'forbidden' };
                }
            }

            return true;
        });

        export default router;
        ```
6. Configurar `frontend/src/main.js`:
    ```js
    import './assets/main.css'

    import { createApp } from 'vue'
    import { createPinia } from 'pinia'

    import App from './App.vue'
    import router from './router'

    const app = createApp(App)

    // Establish a global property for the application name, allowing it to be accessed throughout the app.
    app.config.globalProperties.$appName = import.meta.env.VITE_APP_NAME || 'NodeVue Boilerplate'   // <- Añadir esta línea

    app.use(createPinia())
    app.use(router)

    app.mount('#app')
    ```
7. Helper `frontend/src/utils/swal.js`:
    ```js
    import Swal from 'sweetalert2';

    export const getSwalTheme = () => {
        // Obtenemos los estilos calculados del elemento raíz del documento
        const rootStyles = getComputedStyle(document.documentElement);
        
        const surfaceColor = rootStyles.getPropertyValue('--surface-app').trim();
        const textColor = rootStyles.getPropertyValue('--text-app').trim();
        const borderColor = rootStyles.getPropertyValue('--border-app').trim();

        const isDark = document.documentElement.classList.contains('dark');

        return Swal.mixin({
            background: surfaceColor,
            color: textColor,
            customClass: {
                popup: `rounded-2xl border shadow-2xl`,
                confirmButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors',
                cancelButton: isDark 
                    ? 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                    : 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors'
            },
            buttonsStyling: false,
            // Inyectamos dinámicamente el color del borde mediante estilo en línea por popup
            didOpen: (popup) => {
                popup.style.borderColor = borderColor;
            }
        });
    };   
    ```

## ⚡ Establecer los servicios (`src/services/`)
1. Crear servicio `frontend/src/services/auth.service.js`
    ```js
    /* src/services/auth.service.js */
    import api from '@/api/axios';

    export const authService = {
        // Registrar un nuevo usuario público
        async register(credentials) {
            const response = await api.post('/auth/register', credentials);
            return response.data;
        },

        // Verificar email
        async verifyEmail(token) {
            const response = await api.get(`/auth/verify-email?token=${token}`);
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
        },

        // Recuperar password
        async forgotPassword(email) {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        },

        // Resetear password
        async resetPassword(data) {
            const response = await api.post('/auth/reset-password', data);
            return response.data;
        }    
    };
    ```
    + Maneja únicamente la autenticación y la sesión del usuario actual.
2. Crear servicio `frontend/src/services/user.service.js`:
    ```js
    import api from '@/api/axios';

    export const userService = {
        // --- Perfil propio ---
        async updateProfile(profileData) {
            const response = await api.put('/users/profile', profileData);
            return response.data;
        },

        async uploadAvatar(formData) {
            const response = await api.post('/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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
    ```
    + Gestión de perfil del usuario firmado y operaciones CRUD/Avatar de administración de usuarios (mapea directo a `/users` en Express).
3. Crear servicio `frontend/src/services/role.service.js`:
    ```js
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
    ```
    + Gestión de roles y permisos (mapea directo a `/roles` en Express).
4. Crear servicio `frontend/src/services/audit.service.js`:
    ```js
    import api from '@/api/axios';

    export const diagnosticService = {
        async getSystemDiagnostic() {
            const response = await api.get('/diagnostics/system');
            return response.data;
        }
    };
    ```
    + Gestión exclusiva de registros de auditoría (mapea directo a `/audit-logs` en Express)
5. Crear servico `frontend/src/services/diagnostic.service.js`:
    ```js
    import api from '@/api/axios';

    export const diagnosticService = {
        async getSystemDiagnostic() {
            const response = await api.get('/diagnostics/system');
            return response.data;
        }
    };    
    ```
6. Crear archivo unificador `frontend/src/services/index.js` (Patrón Barrel Export):
    ```js
    export { authService } from './auth.service';
    export { userService } from './user.service';
    export { roleService } from './role.service';
    export { auditService } from './audit.service';
    export { diagnosticService } from './diagnostic.service';
    ```

## 🧩 Componentes
1. Componente Navbar Reutilizable:
    + Crea el archivo `frontend/src/components/Navbar.vue`:
        ```vue
        <script setup>
        import { ref, computed, onMounted, onUnmounted } from 'vue';
        import { useRouter, useRoute } from 'vue-router';
        import { useAuthStore } from '../stores/auth.store';
        import {
            Cog6ToothIcon, 
            Squares2X2Icon, 
            ArrowRightOnRectangleIcon, 
            ChevronDownIcon,
            SunIcon,
            MoonIcon
        } from '@heroicons/vue/24/outline';

        const props = defineProps({
            title: {
                type: String,
                default: 'Dashboard'
            }
        });

        const authStore = useAuthStore();
        const router = useRouter();
        const route = useRoute();

        const isDropdownOpen = ref(false);
        const dropdownRef = ref(null);
        const isDarkMode = ref(false);

        // Inicial del nombre para avatar por defecto
        const userInitial = computed(() => {
            return authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'U';
        });

        // Comprobar si estamos en una ruta administrativa
        const isAdminArea = computed(() => {
            return route.path.startsWith('/admin');
        });

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        // Cerrar dropdown al hacer clic afuera
        const handleClickOutside = (event) => {
            if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
                isDropdownOpen.value = false;
            }
        };

        // Control de error al cargar el logo
        const hasLogoError = ref(false);
        const handleLogoError = () => {
            hasLogoError.value = true;
        };

        // Control de Tema Claro / Oscuro
        const toggleTheme = () => {
            isDarkMode.value = !isDarkMode.value;
            if (isDarkMode.value) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        };

        onMounted(() => {
            document.addEventListener('click', handleClickOutside);
            
            // Cargar preferencia guardada
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                isDarkMode.value = true;
                document.documentElement.classList.add('dark');
            } else {
                isDarkMode.value = false;
                document.documentElement.classList.remove('dark');
            }
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        const handleLogout = async () => {
            await authStore.logout();
            router.push({ name: 'login' });
        };
        </script>

        <template>
            <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-3 px-4 sm:px-6 sticky top-0 z-40 transition-colors">
                <div class="max-w-7xl mx-auto flex items-center justify-between">
                
                    <!-- LADO IZQUIERDO: Logo + Nombre App + Sección Dinámica -->
                    <div class="flex items-center space-x-3">
                        <router-link to="/" class="flex items-center space-x-2">
                            <img 
                                v-if="!hasLogoError"
                                src="/logo.png" 
                                alt="App Logo" 
                                @error="handleLogoError"
                                class="w-8 h-8 object-contain" 
                            />
                            <span class="font-bold text-slate-900 dark:text-slate-100 hidden sm:inline text-lg">{{ $appName }}</span>
                        </router-link>

                        <span class="text-slate-300 dark:text-slate-600 font-light text-xl">/</span>

                        <h1 class="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                            {{ props.title }}
                        </h1>
                    </div>

                    <!-- LADO DERECHO: Botón Tema + Menú de Usuario -->
                    <div class="flex items-center space-x-3">
                        <!-- Botón de Modo Claro / Oscuro -->
                        <button 
                            @click="toggleTheme"
                            class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/40 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 dark:hover:text-white transition-colors focus:outline-none"
                            :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
                        >
                            <SunIcon v-if="isDarkMode" class="w-5 h-5 text-amber-400" />
                            <MoonIcon v-else class="w-5 h-5 text-slate-600" />
                        </button>

                        <!-- Menú Desplegable de Usuario -->
                        <div class="relative" ref="dropdownRef">
                            <button 
                                @click="toggleDropdown"
                                class="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors focus:outline-none"
                            >
                                <!-- Foto de perfil o Inicial -->
                                <div v-if="authStore.user?.avatarUrl" class="w-9 h-9 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                                    <img :src="authStore.user.avatarUrl" :alt="authStore.user.name" class="w-full h-full object-cover" />
                                </div>
                                <div v-else class="w-9 h-9 rounded-full bg-emerald-500/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30 text-sm">
                                    {{ userInitial }}
                                </div>

                                <span class="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:inline-block">
                                    {{ authStore.user?.name }}
                                </span>

                                <ChevronDownIcon class="w-4 h-4 text-slate-400" />
                            </button>

                            <!-- Menú Desplegable -->
                            <Transition
                                enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0"
                            >
                                <div 
                                    v-if="isDropdownOpen"
                                    class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 text-slate-700 dark:text-slate-200"
                                >
                                    <!-- Header pequeño del usuario -->
                                    <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                                        <p class="text-xs text-slate-400">Conectado como</p>
                                        <p class="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">{{ authStore.user?.email }}</p>
                                    </div>

                                    <!-- Item 1: Configuración / Perfil -->
                                    <router-link 
                                        to="/profile" 
                                        @click="isDropdownOpen = false"
                                        class="flex items-center space-x-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <Cog6ToothIcon class="w-4 h-4 text-slate-400" />
                                        <span>Configuración</span>
                                    </router-link>

                                    <!-- Item 2: Alternar entre Admin y Dashboard -->
                                    <router-link 
                                        v-if="authStore.hasPermission('admin:access') && !isAdminArea"
                                        to="/admin" 
                                        @click="isDropdownOpen = false"
                                        class="flex items-center space-x-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 text-purple-600 dark:text-purple-400 transition-colors"
                                    >
                                        <Squares2X2Icon class="w-4 h-4" />
                                        <span>Panel Admin</span>
                                    </router-link>

                                    <router-link 
                                        v-if="isAdminArea" 
                                        to="/dashboard" 
                                        @click="isDropdownOpen = false"
                                        class="flex items-center space-x-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 text-emerald-600 dark:text-emerald-400 transition-colors"
                                    >
                                        <Squares2X2Icon class="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </router-link>

                                    <div class="border-t border-slate-100 dark:border-slate-700/60 my-1"></div>

                                    <!-- Item 3: Cerrar sesión -->
                                    <button 
                                        @click="handleLogout"
                                        class="w-full text-left flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <ArrowRightOnRectangleIcon class="w-4 h-4" />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            </Transition>
                        </div>
                    </div>

                </div>
            </header>
        </template>
        ```
2. Componente para vistas estándar:
    + Crea el archivo `frontend/src/components/common/PageLayout.vue`:
        ```vue
        <!-- src/components/common/PageLayout.vue -->
        <script setup>
        import { computed } from 'vue';
        import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

        const appName = import.meta.env.VITE_APP_NAME || 'Mi Aplicación';
        const currentYear = new Date().getFullYear();

        // 1. Asignamos los props a una constante para poder acceder a ellos
        const props = defineProps({
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                default: ''
            },
            backTo: {
                type: [String, Object],
                default: null
            },
            backText: {
                type: String,
                default: 'Volver'
            },
            showFooter: {
                type: Boolean,
                default: true
            },
            isAdmin: { 
                type: Boolean, 
                default: true 
            }
        });

        // 2. Ahora 'props.isAdmin' ya está definido correctamente y es reactivo
        const footerText = computed(() => {
            if (props.isAdmin) {
                return `© ${currentYear} Panel de Administración. Todos los derechos reservados.`;
            }
            return `© ${currentYear} ${appName}. Todos los derechos reservados.`;
        });
        </script>

        <template>
            <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
                <div class="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
                    
                    <!-- Header / Tarjeta de Encabezado -->
                    <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
                        <div v-if="backTo">
                            <router-link 
                                :to="backTo" 
                                class="inline-flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors group"
                            >
                                <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                                <span>{{ backText }}</span>
                            </router-link>
                        </div>

                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ title }}</h1>
                                <p v-if="description" class="text-sm text-slate-600 dark:text-slate-400">{{ description }}</p>
                            </div>
                            
                            <div v-if="$slots.actions" class="flex items-center gap-2">
                                <slot name="actions" />
                            </div>
                        </div>
                    </div>

                    <!-- Slot para Filtros -->
                    <slot name="filters" />

                    <!-- Slot para el Contenido Principal -->
                    <slot />

                    <!-- Slot para Modales -->
                    <slot name="modales" />

                </div>

                <!-- Pie de página integrado -->
                <footer v-if="showFooter" class="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 px-6 mt-auto text-center text-xs text-slate-500 dark:text-slate-400">
                    <slot name="footer">
                        {{ footerText }}
                    </slot>
                </footer>
            </div>
        </template>        
        ```
3. Componente para login con Google:
    + Cera el archivo `frontend/src/components/auth/GoogleAuthButton.vue`:
        ```vue
        <!-- src/components/auth/GoogleAuthButton.vue -->
        <script setup>
        import { ref, onMounted } from 'vue';
        import { useRouter } from 'vue-router';
        import { useAuthStore } from '@/stores/auth.store';
        import { getSwalTheme } from '@/utils/swal';

        // Única llamada a defineProps combinando ambas propiedades
        const props = defineProps({
            text: {
                type: String,
                default: 'Continuar con Google'
            },
            isRegisterContext: {
                type: Boolean,
                default: false
            }
        });

        const authStore = useAuthStore();
        const router = useRouter();
        const loading = ref(false);
        const googleButtonRef = ref(null);

        onMounted(() => {
            const scriptId = 'google-gsi-script';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.id = scriptId;
                script.async = true;
                script.defer = true;
                script.onload = initGoogleClient;
                document.head.appendChild(script);
            } else {
                initGoogleClient();
            }
        });

        const initGoogleClient = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                    use_fedcm_for_prompt: true
                });

                if (googleButtonRef.value) {
                    window.google.accounts.id.renderButton(googleButtonRef.value, {
                        type: 'standard',
                        theme: 'filled_black',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'rectangular',
                        logo_alignment: 'left'
                    });
                }
            }
        };

        const handleCredentialResponse = async (response) => {
            loading.value = true;
            try {
                const idToken = response.credential;
                const result = await authStore.loginWithGoogle(idToken);
                
                const resData = result.data || result;

                // Redirigimos al dashboard primero
                await router.push({ name: 'dashboard' });

                // Si estamos en el flujo de registro y el backend indicó que la cuenta ya existía
                if (props.isRegisterContext && resData.isNewUser === false) {
                    getSwalTheme().fire({
                        icon: 'info',
                        title: '¡Hola de nuevo!',
                        text: 'Detectamos que ya tenías una cuenta registrada, por lo que hemos iniciado sesión directamente.',
                        toast: true,
                        position: 'center',
                        showConfirmButton: true,
                        confirmButtonText: 'Entendido',
                        timer: 7500
                    });
                }
            } catch (err) {
                console.error('Error al autenticar con el backend:', err);
                getSwalTheme().fire({
                    icon: 'error',
                    title: 'Error de autenticación',
                    text: authStore.error || 'No se pudo iniciar sesión con Google',
                    background: '#1e293b',
                    color: '#f8fafc',
                });
            } finally {
                loading.value = false;
            }
        };
        </script>

        <template>
            <div class="w-full relative">
                <!-- Contenedor donde Google inyectará su botón interactivo y seguro -->
                <div ref="googleButtonRef" class="w-full flex justify-center overflow-hidden rounded-lg"></div>
            </div>
        </template>
        ```
4. Componente para icono de GitHub `frontend/src/components/icons/GithubIcon.vue`:
    ```vue
    <template>
        <svg class="fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    </template>
    ```
## 🎨 Vistas de Autenticación y Dashboard (`src/views/`)
1. Suministrar icono y logo de la aplicación en:
    + Icono: `frontend/public/favicon.ico`.
    + Logo: `frontend/public/logo.png`.
2. Formulario de Inicio de Sesión:
    + Crea el archivo `frontend/src/views/auth/LoginView.vue`:
        ```vue
        <!-- src/views/auth/LoginView.vue -->
        <script setup>
        import { ref } from 'vue';
        import { useRouter } from 'vue-router';
        import { useAuthStore } from '@/stores/auth.store';
        import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
        import GoogleAuthButton from '@/components/auth/GoogleAuthButton.vue';

        const authStore = useAuthStore();
        const router = useRouter();
        const hasLogoError = ref(false);
        const showPassword = ref(false);

        const handleLogoError = () => {
            hasLogoError.value = true;
        };

        const form = ref({
            email: '',
            password: '',
        });

        const handleSubmit = async () => {
            try {
                await authStore.login(form.value);
                router.push({ name: 'dashboard' });
            } catch (err) {
                console.error('Error al iniciar sesión:', err);
            }
        };
        </script>

        <template>
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
                <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                    
                    <!-- Logo Centrado -->
                    <div class="flex flex-col items-center justify-center mb-6">
                        <router-link to="/" class="flex flex-col items-center group">
                            <img 
                                v-if="!hasLogoError" 
                                src="/logo.png" 
                                alt="App Logo" 
                                @error="handleLogoError"
                                class="w-14 h-14 object-contain mb-3 transition-transform group-hover:scale-105" 
                            />
                            <span v-else class="text-4xl mb-2">🌳</span>
                            <span class="font-bold text-center text-xl text-emerald-600 dark:text-emerald-400">{{ $appName }}</span>
                        </router-link>
                    </div>

                    <h2 class="text-xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">Iniciar Sesión</h2>

                    <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
                        {{ authStore.error }}
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                            <input
                                v-model="form.email"
                                type="email"
                                required
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Contraseña</label>
                            <div class="relative">
                                <input
                                    v-model="form.password"
                                    :type="showPassword ? 'text' : 'password'"
                                    required
                                    class="w-full px-4 py-2 pr-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                                    placeholder="••••••••"
                                />
                                <!-- Botón del ojito -->
                                <button 
                                    type="button"
                                    @click="showPassword = !showPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                                >
                                    <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                    <EyeSlashIcon v-else class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            :disabled="authStore.loading"
                            class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {{ authStore.loading ? 'Cargando...' : 'Entrar' }}
                        </button>
                        
                        <!-- Enlace de contraseña olvidada alineado a la derecha -->
                        <div class="flex justify-end mt-1.5">
                            <router-link to="/forgot-password" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                                ¿Olvidaste tu contraseña?
                            </router-link>
                        </div>
                    </form>

                    <!-- Divisor visual -->
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                        <div class="relative flex justify-center text-xs uppercase"><span class="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">O</span></div>
                    </div>

                    <!-- Botón de Google aislado -->
                    <GoogleAuthButton text="Iniciar sesión con Google" />            

                    <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        ¿No tienes cuenta?
                        <router-link to="/register" class="text-emerald-600 dark:text-emerald-400 hover:underline">Regístrate aquí</router-link>
                    </p>
                </div>
            </div>
        </template>
        ```
3. Formulario de Registro:
    + Crea el archivo `frontend/src/views/auth/RegisterView.vue`:
        ```vue
        <!-- src/views/auth/RegisterView.vue -->
        <script setup>
        import { ref } from 'vue';
        import { useRouter } from 'vue-router';
        import { useAuthStore } from '@/stores/auth.store';
        import { authService } from '@/services/auth.service';
        import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
        import GoogleAuthButton from '@/components/auth/GoogleAuthButton.vue';
        import { getSwalTheme } from '@/utils/swal';

        const authStore = useAuthStore();
        const router = useRouter();
        const hasLogoError = ref(false);
        const showPassword = ref(false);

        const handleLogoError = () => {
            hasLogoError.value = true;
        };

        const form = ref({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        });

        const handleSubmit = async () => {
            try {
                authStore.error = null;

                const response = await authService.register(form.value);
                
                const successMessage = response.message || 'Registro exitoso';

                if (response.requiresVerification) {
                    await getSwalTheme().fire({
                        icon: 'success',
                        title: '¡Registro Exitoso!',
                        text: successMessage,
                        confirmButtonText: 'Ir a Iniciar Sesión',
                        confirmButtonColor: '#059669' // esmeralda
                    });

                    router.push({ name: 'login' }); 
                } else {
                    await getSwalTheme().fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: successMessage,
                        timer: 1500,
                        showConfirmButton: false,
                        confirmButtonColor: '#059669'
                    });

                    router.push({ name: 'dashboard' });
                }

            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Ocurrió un error en el registro';
                authStore.error = errorMessage; 

                getSwalTheme().fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorMessage,
                    confirmButtonColor: '#059669'
                });

                console.error('Error en registro:', error);
            }
        };
        </script>

        <template>
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
                <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                    
                    <!-- Logo Centrado -->
                    <div class="flex flex-col items-center justify-center mb-6">
                        <router-link to="/" class="flex flex-col items-center group">
                            <img 
                                v-if="!hasLogoError" 
                                src="/logo.png" 
                                alt="App Logo" 
                                @error="handleLogoError"
                                class="w-14 h-14 object-contain mb-3 transition-transform group-hover:scale-105" 
                            />
                            <span v-else class="text-4xl mb-2">🌳</span>
                            <span class="font-bold text-center text-xl text-emerald-600 dark:text-emerald-400">{{ $appName }}</span>
                        </router-link>
                    </div>

                    <h2 class="text-xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">Crear Cuenta</h2>

                    <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
                        {{ authStore.error }}
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Nombre</label>
                                <input
                                    v-model="form.firstName"
                                    type="text"
                                    required
                                    class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                                    placeholder="Juan"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Apellido</label>
                                <input
                                    v-model="form.lastName"
                                    type="text"
                                    required
                                    class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                                    placeholder="Pérez"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                            <input
                                v-model="form.email"
                                type="email"
                                required
                                class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Contraseña</label>
                            <div class="relative">
                                <input
                                    v-model="form.password"
                                    :type="showPassword ? 'text' : 'password'"
                                    required
                                    class="w-full px-4 py-2 pr-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                                    placeholder="••••••••"
                                />
                                <!-- Botón del ojito -->
                                <button 
                                    type="button"
                                    @click="showPassword = !showPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                                >
                                    <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                    <EyeSlashIcon v-else class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            :disabled="authStore.loading"
                            class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
                        </button>
                    </form>

                    <!-- Divisor visual -->
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                        <div class="relative flex justify-center text-xs uppercase"><span class="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">O</span></div>
                    </div>

                    <!-- Mismo componente reutilizado con otro texto -->
                    <GoogleAuthButton text="Registrarse con Google" :isRegisterContext="true" />            

                    <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        ¿Ya tienes cuenta?
                        <router-link to="/login" class="text-emerald-600 dark:text-emerald-400 hover:underline">Inicia sesión</router-link>
                    </p>
                </div>
            </div>
        </template>
        ```
4. Vista de Verificación:
    + Crea el archivo `frontend/src/views/auth/VerifyEmailView.vue`:
        ```vue
        <!-- src/views/auth/VerifyEmailView.vue -->
        <script setup>
        import { ref, onMounted } from 'vue';
        import { useRoute, useRouter } from 'vue-router';
        import { authService } from '@/services/auth.service';

        const route = useRoute();
        const router = useRouter();

        const loading = ref(true);
        const success = ref(false);
        const message = ref('');

        onMounted(async () => {
            const token = route.query.token;

            if (!token) {
                loading.value = false;
                success.value = false;
                message.value = 'Token de verificación no proporcionado.';
                return;
            }

            try {
                const response = await authService.verifyEmail(token);
                success.value = true;
                message.value = response.message || 'Correo verificado correctamente.';
            } catch (error) {
                success.value = false;
                message.value = error.response?.data?.message || 'Hubo un error al verificar el correo o el token ha expirado.';
            } finally {
                loading.value = false;
            }
        });
        </script>

        <template>
            <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-slate-900 dark:text-white">
                        Verificación de Correo Electrónico
                    </h2>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    <div class="bg-white dark:bg-slate-800 px-6 py-12 shadow sm:rounded-lg sm:px-12 text-center">
                        
                        <!-- Estado Cargando -->
                        <div v-if="loading" class="space-y-4">
                            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent align-[-0.125em]" role="status"></div>
                            <p class="text-sm text-slate-600 dark:text-slate-300">Verificando tu cuenta, por favor espera...</p>
                        </div>

                        <!-- Estado Resultado -->
                        <div v-else class="space-y-6">
                            <div :class="success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'" class="text-lg font-medium">
                                {{ message }}
                            </div>

                            <div>
                                <router-link
                                    to="/login"
                                    class="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                >
                                    Ir a Iniciar Sesión
                                </router-link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </template>        
        ```
5. Vista de recuperaciónde password:
    + Crea el archivo `frontend/src/views/auth/ForgotPasswordView.vue`:
        ```vue
        <!-- src/views/auth/ForgotPasswordView.vue -->
        <script setup>
        import { ref } from 'vue';
        import { authService } from '@/services/auth.service';

        const email = ref('');
        const loading = ref(false);
        const message = ref('');
        const error = ref('');

        const handleSubmit = async () => {
            loading.value = true;
            message.value = '';
            error.value = '';

            try {
                const response = await authService.forgotPassword(email.value);
                message.value = response.message || 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.';
                email.value = '';
            } catch (err) {
                error.value = err.response?.data?.message || 'Ocurrió un error al procesar la solicitud.';
            } finally {
                loading.value = false;
            }
        };
        </script>

        <template>
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 text-slate-900 dark:text-slate-100">
                <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">¿Olvidaste tu contraseña?</h2>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                        </p>
                    </div>

                    <!-- Alerta de éxito -->
                    <div v-if="message" class="mb-4 p-4 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/50 rounded-lg">
                        {{ message }}
                    </div>

                    <!-- Alerta de error -->
                    <div v-if="error" class="mb-4 p-4 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/50 rounded-lg">
                        {{ error }}
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo electrónico</label>
                            <input 
                                type="email" 
                                v-model="email" 
                                required 
                                placeholder="tu@correo.com"
                                class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-200"
                            />
                        </div>

                        <button 
                            type="submit" 
                            :disabled="loading"
                            class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer shadow-md"
                        >
                            {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
                        </button>
                    </form>

                    <div class="text-center mt-6">
                        <router-link to="/login" class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                            &larr; Volver al inicio de sesión
                        </router-link>
                    </div>
                </div>
            </div>
        </template>        
        ```
6. Vista de reseto de password:
    + Crea el archivo `frontend/src/views/auth/ResetPasswordView.vue`:
        ```vue
        <!-- src/views/auth/ResetPasswordView.vue -->
        <script setup>
        import { ref, onMounted } from 'vue';
        import { useRoute, useRouter } from 'vue-router';
        import { authService } from '@/services/auth.service';

        const route = useRoute();
        const router = useRouter();

        const token = ref('');
        const newPassword = ref('');
        const confirmPassword = ref('');
        const loading = ref(false);
        const message = ref('');
        const error = ref('');

        onMounted(() => {
            token.value = route.query.token || '';
            if (!token.value) {
                error.value = 'Token de recuperación inválido o ausente.';
            }
        });

        const handleSubmit = async () => {
            if (newPassword.value !== confirmPassword.value) {
                error.value = 'Las contraseñas no coinciden.';
                return;
            }

            loading.value = true;
            message.value = '';
            error.value = '';

            try {
                const response = await authService.resetPassword({
                    token: token.value,
                    newPassword: newPassword.value
                });
                message.value = response.message || 'Contraseña actualizada correctamente.';
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (err) {
                error.value = err.response?.data?.message || 'El enlace ha expirado o es inválido.';
            } finally {
                loading.value = false;
            }
        };
        </script>

        <template>
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 text-slate-900 dark:text-slate-100">
                <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Restablecer contraseña</h2>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            Ingresa tu nueva contraseña para continuar.
                        </p>
                    </div>

                    <!-- Alerta de éxito -->
                    <div v-if="message" class="mb-4 p-4 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/50 rounded-lg">
                        {{ message }} Redirigiendo al login...
                    </div>

                    <!-- Alerta de error -->
                    <div v-if="error" class="mb-4 p-4 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/50 rounded-lg">
                        {{ error }}
                    </div>

                    <form v-if="token" @submit.prevent="handleSubmit" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva contraseña</label>
                            <input 
                                type="password" 
                                v-model="newPassword" 
                                required 
                                minlength="6"
                                placeholder="Mínimo 6 caracteres"
                                class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-200"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar nueva contraseña</label>
                            <input 
                                type="password" 
                                v-model="confirmPassword" 
                                required 
                                minlength="6"
                                placeholder="Repite tu contraseña"
                                class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-200"
                            />
                        </div>

                        <button 
                            type="submit" 
                            :disabled="loading"
                            class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer shadow-md"
                        >
                            {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
                        </button>
                    </form>

                    <div class="text-center mt-6">
                        <router-link to="/login" class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                            Ir al inicio de sesión
                        </router-link>
                    </div>
                </div>
            </div>
        </template>        
        ```
7. Rediseñar la Landing Page:
    + Reemplaza el contenido de `frontend/src/views/HomeView.vue` para que la raíz / muestre una bienvenida profesional:
        ```vue
        <script setup>
        import { ref } from 'vue';
        import { useAuthStore } from '../stores/auth.store';

        const authStore = useAuthStore();
        const hasLogoError = ref(false);

        // Capturamos la variable de entorno de Vite de forma segura
        const docsUrl = import.meta.env.VITE_DOCS_URL || '';

        const handleLogoError = () => {
            hasLogoError.value = true;
        };
        </script>

        <template>
            <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
                <!-- Navbar simple -->
                <header class="py-4 px-4 sm:px-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left bg-white/50 dark:bg-transparent backdrop-blur-md transition-colors">
                    <!-- Logotipo / Branding -->
                    <router-link to="/" class="flex items-center justify-center gap-2.5 shrink-0 group">
                        <img 
                            v-if="!hasLogoError" 
                            src="/logo.png" 
                            alt="App Logo" 
                            @error="handleLogoError"
                            class="w-8 h-8 object-contain transition-transform group-hover:scale-105" 
                        />
                        <span v-else class="text-2xl">⚡</span>
                        <span class="font-bold text-lg sm:text-xl text-emerald-400 whitespace-nowrap">{{ $appName }}</span>
                    </router-link>

                    <!-- Acciones de Usuario y Enlaces Externos -->
                    <div class="flex items-center justify-center gap-4 shrink-0">
                        <router-link
                            v-if="authStore.isAuthenticated"
                            to="/dashboard"
                            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                        >
                            Ir al Dashboard
                        </router-link>
                        
                        <div v-else class="flex items-center justify-center gap-3 sm:gap-4">
                            <router-link 
                                to="/login" 
                                class="px-3 sm:px-4 py-2 text-slate-300 hover:text-white text-sm font-medium whitespace-nowrap transition-colors"
                            >
                                Iniciar Sesión
                            </router-link>
                            <router-link 
                                to="/register" 
                                class="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                            >
                                Registrarse
                            </router-link>
                        </div>
                    </div>
                </header>

                <!-- Hero Section -->
                <main class="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-12">
                    <!-- Logo Prominente en la landing -->
                    <div class="mb-6 flex justify-center">
                        <img 
                            v-if="!hasLogoError" 
                            src="/logo.png" 
                            alt="App Logo" 
                            @error="handleLogoError"
                            class="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_10px_15px_rgba(16,185,129,0.2)]" 
                        />
                        <span v-else class="text-6xl">🚀</span>
                    </div>

                    <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full mb-6">
                        Fullstack Starter Kit 2026
                    </span>
                    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
                        Acelera el desarrollo de tu aplicación web <span class="text-emerald-400">Enterprise</span>.
                    </h1>
                    <p class="text-slate-400 text-lg mb-8 max-w-xl">
                        Base arquitectónica moderna lista para producción con Node.js, Express, Prisma ORM, PostgreSQL y Vue 3 con Tailwind CSS.
                    </p>
                    
                    <div class="flex flex-wrap items-center justify-center gap-4">
                        <router-link
                            v-if="!authStore.isAuthenticated"
                            to="/register"
                            class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl shadow-lg transition-colors"
                        >
                            Comenzar Ahora
                        </router-link>
                        <router-link
                            v-else
                            to="/dashboard"
                            class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl shadow-lg transition-colors"
                        >
                            Ir a mi Panel
                        </router-link>

                        <!-- Botón secundario opcional en el Hero hacia la Docs -->
                        <a 
                            v-if="docsUrl"
                            :href="docsUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors"
                        >
                            Ver Guías y Docs
                        </a>
                    </div>          
                </main>

                <!-- Footer -->
                <footer class="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
                    &copy; 2026 {{ $appName }}. Todos los derechos reservados.
                </footer>
            </div>
        </template>
        ```
8. Crear el Layout Principal (`frontend/src/layouts/AppLayout.vue`)
    + Crea un layout que envuelva todas las páginas autenticadas:
        ```vue
        <script setup>
        import { computed } from 'vue';
        import { useRoute } from 'vue-router';
        import Navbar from '../components/Navbar.vue';

        const route = useRoute();

        // Extrae el título definido en los meta de la ruta actual
        const pageTitle = computed(() => route.meta.title || 'Dashboard');
        </script>

        <template>
            <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
                <!-- El Navbar permanece estático y vivo siempre -->
                <Navbar :title="pageTitle" />

                <!-- Solo esta zona cambia dinámicamente según la ruta sin pestañeo -->
                <main class="flex-1 w-full">
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </main>
            </div>
        </template>

        <style scoped>
        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.15s ease;
        }
        .fade-enter-from,
        .fade-leave-to {
            opacity: 0;
        }
        </style>
        ```
9. Vista Protegida del Dashboard:
    + Crea el archivo `frontend/src/views/DashboardView.vue`:
        ```vue
        <!-- src/views/DashboardView.vue -->
        <script setup>
        import { computed } from 'vue';
        import { useAuthStore } from '../stores/auth.store';
        import GithubIcon from '@/components/icons/GithubIcon.vue';
        import { 
            ShieldCheckIcon, 
            UserCircleIcon, 
            CommandLineIcon, 
            CpuChipIcon, 
            ArrowRightIcon,
            ServerIcon,
            CheckCircleIcon,
            ArrowTopRightOnSquareIcon
        } from '@heroicons/vue/24/outline';

        const authStore = useAuthStore();
        const appName = import.meta.env.VITE_APP_NAME || 'Mi Aplicación';
        const currentYear = new Date().getFullYear();

        // Verificamos si el usuario tiene rol de administrador o dev
        const isAdmin = computed(() => {
            return authStore.userRoles?.some(role => ['admin', 'super-admin', 'Developer'].includes(role));
        });

        // Texto dinámico para el pie de página (vistas no administrativas)
        const footerText = computed(() => {
            return `© ${currentYear} ${appName}. Todos los derechos reservados.`;
        });
        </script>

        <template>
            <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
                <div class="max-w-7xl mx-auto p-6 space-y-6 flex-1 w-full">
                    <!-- Banner de Bienvenida / Perfil Resumido -->
                    <div class="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border border-slate-300 dark:border-slate-700/60 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center md:items-center justify-between gap-6 text-center md:text-left transition-colors">
                        
                        <!-- Bloque superior/izquierdo: Avatar e Información del usuario -->
                        <div class="flex flex-col md:flex-row items-center gap-4">
                            <!-- Avatar: Centrado arriba en móvil, a la izquierda en desktop -->
                            <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl font-bold shadow-inner shrink-0">
                                {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
                            </div>
                            
                            <!-- Textos: Nombre con punto de estado y correo -->
                            <div class="flex flex-col items-center md:items-start">
                                <div class="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                                    <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">¡Hola, {{ authStore.user?.name }}!</h1>
                                    <span class="flex h-2 w-2 relative shrink-0">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 break-all">{{ authStore.user?.email }}</p>
                            </div>
                        </div>

                        <!-- Bloque de Roles: Abajo en móvil, a la derecha en desktop -->
                        <div class="flex flex-wrap justify-center md:justify-end gap-2">
                            <span 
                                v-for="role in authStore.userRoles" 
                                :key="role"
                                class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1.5"
                            >
                                <ShieldCheckIcon class="w-4 h-4 shrink-0" />
                                {{ role }}
                            </span>
                        </div>
                    </div>

                    <!-- Métricas Rápidas / Stack Info -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
                            <div class="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                                <ServerIcon class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Estado del Sistema</p>
                                <p class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                                    <CheckCircleIcon class="w-4 h-4 text-emerald-500" /> Operativo
                                </p>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
                            <div class="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                                <CommandLineIcon class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Arquitectura</p>
                                <p class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Modular / REST</p>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
                            <div class="p-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl">
                                <CpuChipIcon class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Seguridad Auth</p>
                                <p class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">JWT / Sanctum</p>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
                            <div class="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                <UserCircleIcon class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">ID de Sesión</p>
                                <p class="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">#{{ authStore.user?.id || 'N/A' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Accesos / Acciones Principales -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Tarjeta de Acceso Admin (Si aplica) -->
                        <div v-if="isAdmin" class="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
                            <div>
                                <span class="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-full">Zona Restringida</span>
                                <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-3">Panel de Administración</h2>
                                <p class="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                                    Tienes privilegios asignados para gestionar usuarios, roles, auditoría del sistema y diagnósticos avanzados de la plataforma.
                                </p>
                            </div>
                            <router-link 
                                to="/admin" 
                                class="inline-flex items-center justify-between px-4 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-sm font-medium transition-colors shadow-sm group"
                            >
                                <span>Acceder al Panel Admin</span>
                                <ArrowRightIcon class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </router-link>
                        </div>

                        <!-- Tarjeta de Bienvenida / Info del Boilerplate -->
                        <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between space-y-4">
                            <div>
                                <span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full">Boilerplate Ready</span>
                                <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-3">Explora el Código y Estructura</h2>
                                <p class="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                                    Este entorno demuestra buenas prácticas de desarrollo Full-Stack, separación de responsabilidades, componentes reutilizables y diseño responsivo.
                                </p>
                            </div>
                            <div class="flex items-center gap-3 pt-2">
                                <span class="text-xs text-slate-500 dark:text-slate-400 font-mono">Vue 3 + Tailwind CSS + Pinia</span>
                            </div>
                        </div>

                        <!-- Tarjeta del Repositorio de GitHub -->
                        <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between space-y-4">
                            <div>
                                <div class="flex items-center justify-between">
                                    <span class="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
                                        <GithubIcon class="w-4 h-4 text-slate-700 dark:text-slate-200" />
                                        Open Source
                                    </span>
                                </div>
                                <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-3">Boilerplate Node 2026</h2>
                                <p class="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                                    Explora el código fuente del backend, configuraciones de PostgreSQL, middleware de auditoría y arquitectura modular.
                                </p>
                            </div>
                            <div class="flex items-center justify-between pt-2">
                                <span class="text-xs text-slate-500 dark:text-slate-400 font-mono">Node.js + Express</span>
                                <a 
                                    href="https://github.com/petrix12/boilerplate-node-2026" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
                                >
                                    Ver Repositorio
                                    <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>            
                    </div>
                </div>

                <!-- Pie de página integrado -->
                <footer class="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 px-6 mt-auto text-center text-xs text-slate-500 dark:text-slate-400">
                    {{ footerText }}
                </footer>
            </div>
        </template>
        ```
10. Vista de Configuración / Perfil (`frontend/src/views/ProfileView.vue`)
    + Crearemos la nueva pantalla de perfil limpia y estructurada:
        ```vue
        <!-- src/views/ProfileView.vue -->
        <script setup>
        import { ref, watch } from 'vue';
        import { useAuthStore } from '@/stores/auth.store';
        import { userService } from '@/services';
        import { UserIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
        import { getSwalTheme } from '@/utils/swal';
        import PageLayout from '@/components/common/PageLayout.vue';

        const authStore = useAuthStore();
        const showCurrentPassword = ref(false);
        const showNewPassword = ref(false)
        const fileInputRef = ref(null);
        const saving = ref(false);

        // Estado para controlar el efecto visual cuando arrastras sobre la zona
        const isDragging = ref(false);

        // Formulario reactivo
        const profileForm = ref({
            name: authStore.user?.name || '',
            email: authStore.user?.email || '',
            currentPassword: '',
            newPassword: '',
            avatarUrl: authStore.user?.avatarUrl || null,
            avatarFile: null
        });

        // Sincronizar cambios en authStore.user
        watch(() => authStore.user, (newUser) => {
            if (newUser) {
                profileForm.value.name = newUser.name || '';
                profileForm.value.email = newUser.email || '';
                if (!profileForm.value.avatarFile) {
                    profileForm.value.avatarUrl = newUser.avatarUrl || null;
                }
            }
        }, { immediate: true });

        // Previsualizar la imagen seleccionada localmente
        const handleAvatarChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Validar tamaño máximo (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    getSwalTheme().fire({
                        title: 'Archivo muy grande',
                        text: 'La imagen supera el tamaño máximo permitido de 2MB.',
                        icon: 'warning'
                    });
                    if (fileInputRef.value) fileInputRef.value.value = '';
                    return;
                }

                // Liberar ObjectURL anterior si existía para evitar leaks de memoria
                if (profileForm.value.avatarUrl && profileForm.value.avatarUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(profileForm.value.avatarUrl);
                }

                profileForm.value.avatarFile = file;
                profileForm.value.avatarUrl = URL.createObjectURL(file);
            }
        };

        // Cancelar/Quitar selección local de la foto
        const removeAvatarSelection = () => {
            if (profileForm.value.avatarUrl && profileForm.value.avatarUrl.startsWith('blob:')) {
                URL.revokeObjectURL(profileForm.value.avatarUrl);
            }
            profileForm.value.avatarFile = null;
            profileForm.value.avatarUrl = authStore.user?.avatarUrl || null;
            if (fileInputRef.value) fileInputRef.value.value = '';
        };

        // Guardar Cambios del Perfil
        const updateProfile = async () => {
            const nameChanged = profileForm.value.name !== authStore.user?.name;
            const passwordProvided = Boolean(profileForm.value.newPassword);
            const avatarProvided = Boolean(profileForm.value.avatarFile);

            if (!avatarProvided && !nameChanged && !passwordProvided) {
                getSwalTheme().fire({
                    title: 'Sin cambios',
                    text: 'No has realizado ninguna modificación en tu perfil.',
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false
                });
                return;
            }

            // Validación de contraseña si intenta cambiarla
            if (passwordProvided && !profileForm.value.currentPassword) {
                getSwalTheme().fire({
                    title: 'Campo requerido',
                    text: 'Debes ingresar tu contraseña actual para establecer una nueva.',
                    icon: 'warning'
                });
                return;
            }

            saving.value = true;

            try {
                let updatedUserData = null;

                // 1. Subir Avatar vía userService
                if (profileForm.value.avatarFile) {
                    const formData = new FormData();
                    formData.append('avatar', profileForm.value.avatarFile);

                    const avatarRes = await userService.uploadAvatar(formData);
                    updatedUserData = avatarRes.data?.user || avatarRes.user;
                }

                // 2. Actualizar Datos de Perfil (Nombre y/o Contraseña) vía userService
                if (nameChanged || passwordProvided) {
                    const profilePayload = {
                        name: profileForm.value.name,
                        ...(passwordProvided && {
                            currentPassword: profileForm.value.currentPassword,
                            newPassword: profileForm.value.newPassword
                        })
                    };

                    const profileRes = await userService.updateProfile(profilePayload);
                    updatedUserData = profileRes.data?.user || profileRes.user;
                }

                // 3. Actualizar Store de Pinia
                if (updatedUserData) {
                    if (typeof authStore.setUser === 'function') {
                        authStore.setUser(updatedUserData);
                    } else {
                        authStore.user = { ...authStore.user, ...updatedUserData };
                    }
                }

                // Limpieza de campos de contraseña y archivos
                profileForm.value.currentPassword = '';
                profileForm.value.newPassword = '';
                profileForm.value.avatarFile = null;
                if (fileInputRef.value) fileInputRef.value.value = '';

                getSwalTheme().fire({
                    title: '¡Perfil actualizado!',
                    text: 'Tus datos se han guardado correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('Error al actualizar perfil:', error);
                getSwalTheme().fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Ocurrió un error al intentar actualizar el perfil.',
                    icon: 'error'
                });
            } finally {
                saving.value = false;
            }
        };

        // Eliminar avatar definitivamente
        const removeCurrentAvatar = async () => {
            const isDarkTheme = document.documentElement.classList.contains('dark');
            const confirmResult = await getSwalTheme().fire({
                title: '¿Eliminar foto de perfil?',
                text: 'Tu avatar se borrará permanentemente de tu cuenta.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    popup: isDarkTheme ? 'rounded-2xl border border-slate-700 shadow-2xl' : 'rounded-2xl border border-slate-200 shadow-2xl',
                    confirmButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-red-600 hover:bg-red-500 text-white transition-colors mr-3',
                    cancelButton: isDarkTheme 
                        ? 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                        : 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors'
                }
            });

            if (!confirmResult.isConfirmed) return;

            saving.value = true;

            try {
                const response = await userService.deleteAvatar();
                const updatedUser = response.data?.user || response.user;

                if (typeof authStore.setUser === 'function') {
                    authStore.setUser(updatedUser);
                } else {
                    authStore.user = { ...authStore.user, avatarUrl: null };
                }

                profileForm.value.avatarUrl = null;
                profileForm.value.avatarFile = null;
                if (fileInputRef.value) fileInputRef.value.value = '';

                getSwalTheme().fire({
                    title: 'Eliminada',
                    text: 'Tu foto de perfil ha sido eliminada.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('Error al eliminar avatar:', error);
                getSwalTheme().fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al eliminar la imagen de perfil.',
                    icon: 'error'
                });
            } finally {
                saving.value = false;
            }
        };

        // Función para manejar el evento Drop
        const handleDrop = (event) => {
            isDragging.value = false;
            const files = event.dataTransfer?.files;
            if (files && files.length > 0) {
                const file = files[0];
                
                // 1. Validar que sea una imagen
                if (!file.type.startsWith('image/')) {
                    getSwalTheme().fire({
                        title: 'Archivo inválido',
                        text: 'Por favor, arrastra un archivo de imagen válido.',
                        icon: 'warning'
                    });
                    return;
                }

                // 2. Validar tamaño máximo (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    getSwalTheme().fire({
                        title: 'Archivo muy grande',
                        text: 'La imagen supera el tamaño máximo permitido de 2MB.',
                        icon: 'warning'
                    });
                    return;
                }

                // Liberar ObjectURL anterior si existía para evitar leaks de memoria
                if (profileForm.value.avatarUrl && profileForm.value.avatarUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(profileForm.value.avatarUrl);
                }

                // Asignamos el archivo correctamente
                profileForm.value.avatarFile = file;
                profileForm.value.avatarUrl = URL.createObjectURL(file);
            }
        };
        </script>

        <template>
            <PageLayout 
                title="Mi Perfil" 
                description="Administra tu información personal y seguridad de la cuenta."
                :backTo="'/dashboard'"
                backText="Volver al Dashboard"
                :isAdmin="false"
            >
                <form @submit.prevent="updateProfile" class="space-y-6">
                    <!-- Sección Avatar & Datos Básicos con Drag & Drop -->
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors">
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <UserIcon class="w-5 h-5 text-emerald-400" />
                            Información Personal
                        </h3>

                        <!-- Contenedor principal con eventos de Drag & Drop -->
                        <div 
                            class="flex flex-col sm:flex-row items-center gap-6 mb-6 p-4 rounded-xl border-2 border-dashed transition-all duration-200"
                            :class="isDragging ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]' : 'border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/30'"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="handleDrop"
                        >
                            <!-- Avatar Preview -->
                            <div class="relative w-24 h-24 rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0 shadow-inner">
                                <img 
                                    v-if="profileForm.avatarUrl" 
                                    :src="profileForm.avatarUrl" 
                                    alt="Avatar de usuario"
                                    class="w-full h-full object-cover" 
                                />
                                <span v-else class="text-3xl font-bold text-emerald-400">
                                    {{ profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U' }}
                                </span>
                            </div>

                            <!-- Botones y Mensaje de guía -->
                            <div class="flex flex-col space-y-2 text-center sm:text-left w-full">
                                <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                                    <label class="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition-colors shadow-md">
                                        <span>Cambiar Foto</span>
                                        <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                                    </label>

                                    <button 
                                        v-if="profileForm.avatarFile" 
                                        type="button" 
                                        @click="removeAvatarSelection" 
                                        class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-300 rounded-xl transition-colors"
                                    >
                                        Cancelar Selección
                                    </button>

                                    <button 
                                        v-else-if="authStore.user?.avatarUrl" 
                                        type="button" 
                                        @click="removeCurrentAvatar" 
                                        class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-red-400 rounded-xl transition-colors"
                                    >
                                        Quitar Foto
                                    </button>
                                </div>
                                <p class="text-xs text-slate-400 pt-1">
                                    <span class="text-emerald-400 font-medium">Arrastra una imagen aquí</span> o usa el botón. JPG, PNG / Máx. 2MB.
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nombre Completo</label>
                                <input 
                                    v-model="profileForm.name" 
                                    type="text" 
                                    required 
                                    class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                                <input 
                                    v-model="profileForm.email" 
                                    type="email" 
                                    disabled 
                                    class="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Sección Seguridad -->
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors">
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <KeyIcon class="w-5 h-5 text-emerald-400" />
                            Cambiar Contraseña
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Contraseña Actual -->
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Contraseña Actual</label>
                                <div class="relative">
                                    <input 
                                        v-model="profileForm.currentPassword" 
                                        :type="showCurrentPassword ? 'text' : 'password'" 
                                        placeholder="••••••••" 
                                        class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                    />
                                    <button 
                                        type="button"
                                        @click="showCurrentPassword = !showCurrentPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                                    >
                                        <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5" />
                                        <EyeSlashIcon v-else class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <!-- Nueva Contraseña -->
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nueva Contraseña</label>
                                <div class="relative">
                                    <input 
                                        v-model="profileForm.newPassword" 
                                        :type="showNewPassword ? 'text' : 'password'" 
                                        placeholder="••••••••" 
                                        class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                    />
                                    <button 
                                        type="button"
                                        @click="showNewPassword = !showNewPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                                    >
                                        <EyeIcon v-if="!showNewPassword" class="w-5 h-5" />
                                        <EyeSlashIcon v-else class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button 
                            type="submit" 
                            :disabled="saving" 
                            class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                            <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
                        </button>
                    </div>
                </form>
            </PageLayout>
        </template>
        ```
11. Limpiar `App.vue`:
    + Abre `frontend/src/App.vue` y reemplaza todo su contenido con esto:
        ```vue
        <script setup>
        import { RouterView } from 'vue-router'
        import { useThemeStore } from '@/stores/theme.store'
        useThemeStore()
        </script>

        <template>
            <RouterView />
        </template>
        ```
12. Crear vista administrativa `frontend/src/views/admin/AdminDashboardView.vue`:
    ```vue
    <!-- src/views/admin/AdminDashboardView.vue -->
    <script setup>
        import { computed, onMounted } from 'vue';
        import { useAuthStore } from '@/stores/auth.store';
        import { UsersIcon, ShieldCheckIcon, DocumentChartBarIcon, CpuChipIcon } from '@heroicons/vue/24/outline';
        import PageLayout from '@/components/common/PageLayout.vue';

        const authStore = useAuthStore();

        // Aseguramos que si por alguna razón el user no está completo al entrar, se consulte al backend
        onMounted(async () => {
            if (authStore.token && (!authStore.user || !authStore.user.hasOwnProperty('aiDiagnostic'))) {
                await authStore.fetchUser();
            }
        });

        const isAiActive = computed(() => authStore.aiDiagnosticActive);
    </script>

    <template>
        <PageLayout 
            title="Panel de Administración" 
            description="Gestiona la configuración global de la plataforma, accesos y permisos."
            :backTo="'/dashboard'"
            backText="Volver al Dashboard"
        >
            <!-- Grid de Accesos Directos a Módulos Admin (Cada uno con su identidad de color intacta) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- Módulo: Usuarios -->
                <router-link 
                    to="/admin/users" 
                    class="group p-6 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                            <UsersIcon class="w-6 h-6" />
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">Activo</span>
                    </div>
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">Gestión de Usuarios</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-1">Creación, edición de datos personales, asignación de roles y eliminación.</p>
                </router-link>

                <!-- Módulo: Roles y Permisos -->
                <router-link 
                    to="/admin/roles" 
                    class="group p-6 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-purple-500/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-purple-500/5"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                            <ShieldCheckIcon class="w-6 h-6" />
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full">Dev / Config</span>
                    </div>
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Roles y Permisos</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-1">Administración de la tabla de roles globales del sistema (CRUD de Roles).</p>
                </router-link>

                <!-- Módulo: Logs de Auditoría / Sistema -->
                <router-link 
                    to="/admin/audit-logs" 
                    class="group p-6 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-yellow-500/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-yellow-500/5"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl group-hover:scale-110 transition-transform">
                            <DocumentChartBarIcon class="w-6 h-6" />
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 rounded-full">Sistema</span>
                    </div>
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Auditoría / Logs</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-1">Historial de cambios críticos y acciones de los administradores.</p>
                </router-link>

                <!-- Módulo: Diagnóstico del Sistema por IA -->
                <router-link 
                    v-if="isAiActive"
                    to="/admin/system-diagnostic"
                    class="group p-6 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                            <CpuChipIcon class="w-6 h-6" />
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-full">IA Activa</span>
                    </div>
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">Diagnóstico del Sistema por IA</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-1">Análisis inteligente del estado, salud y seguridad global.</p>
                </router-link>

            </div>
        </PageLayout>
    </template>
    ```
13. 🎨 Crear la Vista UsersAdminView.vue (`frontend/src/views/admin/UsersAdminView.vue`):
    + Crea la carpeta src/views/admin/ si no existe y añade la vista:
        ```vue
        <!-- src/views/admin/UsersAdminView.vue -->
        <script setup>
        import { TrashIcon, UserGroupIcon, PencilSquareIcon, PlusIcon, MagnifyingGlassIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
        import { ref, onMounted } from 'vue';
        import { userService, roleService } from '@/services';
        import { useAuthStore } from '@/stores/auth.store';
        import { getSwalTheme } from '@/utils/swal';
        import PageLayout from '@/components/common/PageLayout.vue';

        // Instancia del store para acceder a los getters
        const authStore = useAuthStore();

        // --- ESTADOS GENERALES Y TABLA ---
        const users = ref([]);
        const loading = ref(true);
        const saving = ref(false);
        const searchQuery = ref('');
        const pagination = ref({ page: 1, totalPages: 1, total: 0 });
        let searchTimeout = null;

        // --- ESTADOS PARA EDICIÓN DE ROLES ---
        const selectedUser = ref(null);
        const modalRoles = ref([]);
        const availableRoles = ref([]);

        // --- ESTADOS PARA CREACIÓN / EDICIÓN COMPLETA DE USUARIO ---
        const isUserModalOpen = ref(false);
        const targetUser = ref(null);
        const fileInputRef = ref(null);
        const uploadingAvatar = ref(false);
        const isDragging = ref(false);
        const showUserPassword = ref(false);
        const DEFAULT_PASSWORD = 'Password123*';

        const userForm = ref({
            name: '',
            email: '',
            password: '',
            avatarUrl: null,
            avatarFile: null
        });

        // Manejar cambio/subida de imagen mediante el input file tradicional
        const handleAvatarChange = (event) => {
            const file = event.target.files[0];
            processSelectedFile(file);
        };

        // Eliminar foto de perfil
        const removeAvatar = async () => {
            if (targetUser.value) {
                uploadingAvatar.value = true;
                try {
                    await userService.deleteUserAvatarById(targetUser.value.id);
                    
                    userForm.value.avatarUrl = null;
                    userForm.value.avatarFile = null;
                    targetUser.value.avatarUrl = null;
                    targetUser.value.avatar = null;
                } catch (err) {
                    getSwalTheme().fire({
                        title: 'Error',
                        text: err.response?.data?.message || 'Error al eliminar la imagen',
                        icon: 'error'
                    });
                } finally {
                    uploadingAvatar.value = false;
                }
            } else {
                userForm.value.avatarFile = null;
                userForm.value.avatarUrl = null;
            }

            if (fileInputRef.value) {
                fileInputRef.value.value = '';
            }
        };      

        // --- LÓGICA DE CARGA Y BÚSQUEDA ---
        const sortBy = ref('createdAt');
        const sortOrder = ref('desc');

        const handleSort = (field) => {
            if (sortBy.value === field) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortBy.value = field;
                sortOrder.value = 'asc';
            }
            fetchUsers(1);
        };

        const fetchUsers = async (page = 1) => {
            loading.value = true;
            try {
                const res = await userService.getUsers({
                    search: searchQuery.value,
                    page,
                    limit: 10,
                    sortBy: sortBy.value,
                    sortOrder: sortOrder.value
                });
                users.value = res.data.users;
                pagination.value = res.data.pagination;
            } catch (err) {
                console.error('Error al cargar usuarios:', err);
            } finally {
                loading.value = false;
            }
        };      

        const handleSearch = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                fetchUsers(1);
            }, 300);
        };

        const changePage = (newPage) => {
            fetchUsers(newPage);
        };

        // --- LÓGICA DE ROLES ---
        const openRoleModal = (user) => {
            selectedUser.value = user;
            modalRoles.value = [...user.roles];
        };

        const saveUserRoles = async () => {
            if (!selectedUser.value) return;
            saving.value = true;
            try {
                await userService.updateUserRoles(selectedUser.value.id, modalRoles.value);
                selectedUser.value.roles = [...modalRoles.value];
                selectedUser.value = null;

                getSwalTheme().fire({
                    title: '¡Roles actualizados!',
                    text: 'Los permisos del usuario se han modificado correctamente.',
                    icon: 'success',
                    timer: 2200,
                    showConfirmButton: false
                });
            } catch (err) {
                getSwalTheme().fire({
                    title: 'Error',
                    text: err.response?.data?.message || 'Error al guardar los roles del usuario.',
                    icon: 'error'
                });
            } finally {
                saving.value = false;
            }
        };

        // --- LÓGICA DE CREACIÓN / EDICIÓN DE USUARIO ---
        const openUserModal = (user = null) => {
            targetUser.value = user;
            if (user) {
                userForm.value = { 
                    name: user.name, 
                    email: user.email, 
                    avatarUrl: user.avatarUrl || user.avatar || null,
                    avatarFile: null,
                    password: '' 
                };
            } else {
                userForm.value = { name: '', email: '', password: '', avatarUrl: null, avatarFile: null };
            }
            isUserModalOpen.value = true;
        };

        const saveUserData = async () => {
            saving.value = true;
            try {
                if (targetUser.value) {
                    const payload = { 
                        name: userForm.value.name, 
                        email: userForm.value.email 
                    };
                    if (userForm.value.password) payload.password = userForm.value.password;

                    const res = await userService.updateUser(targetUser.value.id, payload);
                    
                    targetUser.value.name = res.data.user.name;
                    targetUser.value.email = res.data.user.email;

                    getSwalTheme().fire({
                        title: '¡Actualizado!',
                        text: 'Los datos del usuario han sido actualizados correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    const passwordToUse = userForm.value.password.trim() !== '' 
                        ? userForm.value.password 
                        : DEFAULT_PASSWORD;

                    const res = await userService.createUser({
                        name: userForm.value.name,
                        email: userForm.value.email,
                        password: passwordToUse
                    });

                    const newUserId = res.data.user.id;

                    if (userForm.value.avatarFile && newUserId) {
                        const formData = new FormData();
                        formData.append('avatar', userForm.value.avatarFile);
                        await userService.uploadUserAvatarById(newUserId, formData);
                    }

                    await fetchUsers(1);

                    const usedDefault = !userForm.value.password.trim();
                    const passwordInfo = usedDefault 
                        ? '<br><span class="text-xs text-amber-400 mt-1 block">Contraseña asignada por defecto: <strong>Password123*</strong></span>' 
                        : '';

                    getSwalTheme().fire({
                        title: '¡Usuario creado exitosamente!',
                        html: `Se ha registrado a <strong>${userForm.value.name}</strong> en el sistema.${passwordInfo}`,
                        icon: 'success',
                        showConfirmButton: usedDefault,
                        confirmButtonText: 'Entendido',
                        timer: usedDefault ? undefined : 2500
                    });
                }
                isUserModalOpen.value = false;
            } catch (err) {
                getSwalTheme().fire({
                    title: 'Error',
                    text: err.response?.data?.message || 'Error al procesar la solicitud',
                    icon: 'error'
                });
            } finally {
                saving.value = false;
            }
        };

        // --- LÓGICA DE ELIMINACIÓN ---
        const confirmDeleteUser = async (user) => {
            const isDarkTheme = document.documentElement.classList.contains('dark');
            const result = await getSwalTheme().fire({
                title: '¿Eliminar usuario?',
                html: `Estás a punto de eliminar a <strong>${user.name}</strong>.<br><span class="text-xs text-slate-400">Esta acción no se puede deshacer.</span>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    popup: isDarkTheme ? 'rounded-xl border border-slate-700 shadow-2xl' : 'rounded-xl border border-slate-200 shadow-2xl',
                    confirmButton: 'px-4 py-2 rounded-lg font-medium text-sm bg-red-600 hover:bg-red-500 text-white transition-colors mr-3',
                    cancelButton: isDarkTheme 
                        ? 'px-4 py-2 rounded-lg font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                        : 'px-4 py-2 rounded-lg font-medium text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors'
                }
            });

            if (result.isConfirmed) {
                try {
                    await userService.deleteUser(user.id);
                    
                    getSwalTheme().fire({
                        title: '¡Eliminado!',
                        text: 'El usuario ha sido eliminado correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    await fetchUsers(pagination.value.page);
                } catch (err) {
                    getSwalTheme().fire({
                        title: 'Error',
                        text: err.response?.data?.message || 'Error al intentar eliminar el usuario',
                        icon: 'error'
                    });
                }
            }
        };      

        // --- UTILITIES ---
        const getRoleBadgeClass = (role) => {
            switch (role) {
                case 'SUPER_ADMIN':
                    return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
                case 'ADMIN':
                    return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
                case 'USER':
                    return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30';
                default:
                    return 'bg-amber-100 dark:bg-yellow-900/40 text-amber-800 dark:text-yellow-300 border-amber-300 dark:border-yellow-500/30';
            }
        };

        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            return new Date(dateStr).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        };

        const fetchAvailableRoles = async () => {
            try {
                const res = await roleService.getRoles();
                const rolesData = res.data.roles || res.data;
                availableRoles.value = rolesData.map((r) => (typeof r === 'object' ? r.name : r));
            } catch (err) {
                console.error('Error al cargar roles disponibles:', err);
            }
        };

        const processSelectedFile = async (file) => {
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                getSwalTheme().fire({
                    title: 'Archivo inválido',
                    text: 'Por favor, selecciona o arrastra un archivo de imagen válido.',
                    icon: 'warning'
                });
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                getSwalTheme().fire({
                    title: 'Archivo muy grande',
                    text: 'La imagen supera el tamaño máximo permitido de 2MB.',
                    icon: 'warning'
                });
                if (fileInputRef.value) fileInputRef.value.value = '';
                return;
            }

            if (targetUser.value) {
                uploadingAvatar.value = true;
                try {
                    const formData = new FormData();
                    formData.append('avatar', file, file.name);

                    const res = await userService.uploadUserAvatarById(targetUser.value.id, formData);
                    
                    const updatedAvatar = res.data?.user?.avatarUrl || URL.createObjectURL(file);
                    userForm.value.avatarUrl = updatedAvatar;
                    targetUser.value.avatarUrl = updatedAvatar;
                    targetUser.value.avatar = updatedAvatar;
                } catch (err) {
                    getSwalTheme().fire({
                        title: 'Error',
                        text: err.response?.data?.message || 'Error al subir la imagen',
                        icon: 'error'
                    });
                } finally {
                    uploadingAvatar.value = false;
                }
            } else {
                if (userForm.value.avatarUrl && userForm.value.avatarUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(userForm.value.avatarUrl);
                }
                userForm.value.avatarFile = file;
                userForm.value.avatarUrl = URL.createObjectURL(file);
            }
        };

        const handleDrop = (event) => {
            isDragging.value = false;
            const files = event.dataTransfer?.files;
            if (files && files.length > 0) {
                processSelectedFile(files[0]);
            }
        };

        onMounted(() => {
            fetchUsers();
            fetchAvailableRoles();
        });   
        </script>

        <template>
            <PageLayout 
                title="Gestión de Usuarios" 
                description="Administra los permisos y accesos de la plataforma en tiempo real."
                :backTo="'/admin'"
                backText="Volver al Panel Admin"
            >
                <!-- Slot para Botón de Acción Principal -->
                <template #actions>
                    <button
                        v-if="authStore.hasPermission('users:create')"
                        @click="openUserModal(null)"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-600/35 shrink-0 cursor-pointer"
                    >
                        <PlusIcon class="w-5 h-5" />
                        Nuevo Usuario
                    </button>
                </template>

                <!-- Slot para Filtros (Barra de Búsqueda) -->
                <template #filters>
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm rounded-2xl p-4 transition-colors">
                        <div class="relative">
                            <input
                                v-model="searchQuery"
                                @input="handleSearch"
                                type="text"
                                placeholder="Buscar por nombre o correo electrónico..."
                                class="w-full bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                            />
                            <MagnifyingGlassIcon class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                        </div>
                    </div>
                </template>

                <!-- Contenido principal: Tabla de Usuarios -->
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm overflow-hidden transition-colors">
                    <div v-if="loading" class="p-12 text-center text-slate-400">
                        <span class="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-2"></span>
                        <p>Cargando usuarios...</p>
                    </div>

                    <div v-else-if="users.length === 0" class="p-12 text-center text-slate-400">
                        No se encontraron usuarios que coincidan con la búsqueda.
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider select-none transition-colors">
                                    <th @click="handleSort('name')" class="px-6 py-3.5 cursor-pointer hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Usuario</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'name' && sortOrder === 'asc' ? 'text-emerald-400' : 'text-slate-600'">▲</span>
                                                <span :class="sortBy === 'name' && sortOrder === 'desc' ? 'text-emerald-400' : 'text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3.5">Roles Asignados</th>
                                    <th @click="handleSort('createdAt')" class="px-6 py-3.5 cursor-pointer hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Fecha Registro</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-emerald-400' : 'text-slate-600'">▲</span>
                                                <span :class="sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-emerald-400' : 'text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3.5 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 dark:divide-slate-700/60 text-sm">
                                <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 uppercase border border-slate-300 dark:border-slate-600 overflow-hidden shrink-0 transition-colors">
                                                <img 
                                                    v-if="user.avatarUrl || user.avatar" 
                                                    :src="user.avatarUrl || user.avatar" 
                                                    :alt="user.name"
                                                    class="w-full h-full object-cover" 
                                                />
                                                <span v-else>{{ user.name ? user.name.charAt(0) : 'U' }}</span>
                                            </div>
                                            <div class="ml-4">
                                                <div class="font-medium text-slate-900 dark:text-slate-200">{{ user.name }}</div>
                                                <div class="text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex flex-wrap gap-1.5">
                                            <span
                                                v-for="role in user.roles"
                                                :key="role"
                                                :class="getRoleBadgeClass(role)"
                                                class="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                                            >
                                                {{ role }}
                                            </span>
                                            <span v-if="user.roles.length === 0" class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 transition-colors">
                                                Sin permisos (Guest)
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                                        {{ formatDate(user.createdAt) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right font-medium">
                                        <div class="inline-flex items-center justify-end space-x-2">
                                            <button
                                                v-if="authStore.hasPermission('users:update')"
                                                @click="openUserModal(user)"
                                                title="Editar datos del usuario"
                                                class="h-9 w-9 inline-flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all cursor-pointer"
                                            >
                                                <PencilSquareIcon class="w-4 h-4" />
                                            </button>

                                            <button
                                                v-if="authStore.hasPermission('users:delete')"
                                                @click="confirmDeleteUser(user)"
                                                title="Eliminar usuario"
                                                class="h-9 w-9 inline-flex items-center justify-center bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                                            >
                                                <TrashIcon class="w-4 h-4" />
                                            </button>

                                            <button
                                                v-if="authStore.hasPermission('roles:update')"
                                                @click="openRoleModal(user)"
                                                title="Editar Roles"
                                                class="h-9 px-3 inline-flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-lg transition-all cursor-pointer"
                                            >
                                                <UserGroupIcon class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Paginación -->
                    <div v-if="pagination.totalPages > 1" class="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors">
                        <span class="text-sm text-slate-600 dark:text-slate-400">
                            Página {{ pagination.page }} de {{ pagination.totalPages }}
                        </span>
                        <div class="flex gap-2">
                            <button
                                :disabled="pagination.page === 1"
                                @click="changePage(pagination.page - 1)"
                                class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
                            >
                                Anterior
                            </button>
                            <button
                                :disabled="pagination.page === pagination.totalPages"
                                @click="changePage(pagination.page + 1)"
                                class="px-3 py-1 bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Slot para Modales -->
                <template #modales>
                    <!-- Modal de Asignación de Roles -->
                    <div v-if="selectedUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl transition-colors">
                            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Gestionar Roles</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Modificando permisos para <span class="text-emerald-400 font-semibold">{{ selectedUser.name }}</span>
                            </p>

                            <div class="space-y-3 mb-6">
                                <label v-for="role in availableRoles" :key="role" class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        :value="role"
                                        v-model="modalRoles"
                                        class="w-4 h-4 text-emerald-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <span class="text-sm font-medium text-slate-900 dark:text-slate-200">{{ role }}</span>
                                </label>
                            </div>

                            <div class="flex justify-end gap-3">
                                <button
                                    @click="selectedUser = null"
                                    class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition-colors text-sm cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    @click="saveUserRoles"
                                    :disabled="saving"
                                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors text-sm cursor-pointer"
                                >
                                    {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Modal de Usuario (Creación / Edición) -->
                    <div v-if="isUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl transition-colors">
                            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {{ targetUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
                            </h3>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {{ targetUser ? `Modificando los datos de ${targetUser.name}` : 'Ingresa la información del nuevo usuario' }}
                            </p>

                            <form @submit.prevent="saveUserData" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nombre Completo</label>
                                    <input
                                        v-model="userForm.name"
                                        type="text"
                                        required
                                        class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                                    <input
                                        v-model="userForm.email"
                                        type="email"
                                        required
                                        class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <div class="flex justify-between items-center mb-1">
                                        <label class="block text-xs font-semibold uppercase text-slate-400">
                                            Contraseña {{ targetUser ? '(Opcional / Dejar en blanco)' : '' }}
                                        </label>
                                        <span v-if="!targetUser" class="text-[11px] text-amber-600 dark:text-amber-400/90 font-medium">
                                            Si se deja vacía, será: <code class="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300 font-mono">{{ DEFAULT_PASSWORD }}</code>
                                        </span>
                                    </div>
                                    <div class="relative">
                                        <input
                                            v-model="userForm.password"
                                            :type="showUserPassword ? 'text' : 'password'"
                                            placeholder="••••••••"
                                            class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                        />
                                        <button 
                                            type="button"
                                            @click="showUserPassword = !showUserPassword"
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                                        >
                                            <EyeIcon v-if="!showUserPassword" class="w-5 h-5" />
                                            <EyeSlashIcon v-else class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Contenedor principal con eventos de Drag & Drop -->
                                <div 
                                    class="flex items-center space-x-4 p-3 rounded-xl border-2 border-dashed transition-all duration-200 mb-4"
                                    :class="isDragging ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]' : 'border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/30'"
                                    @dragover.prevent="isDragging = true"
                                    @dragleave.prevent="isDragging = false"
                                    @drop.prevent="handleDrop"
                                >
                                    <div class="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-slate-300 dark:border-slate-600 shrink-0 shadow-inner">
                                        <img 
                                            v-if="userForm.avatarUrl" 
                                            :src="userForm.avatarUrl" 
                                            :alt="userForm.name"
                                            class="w-full h-full object-cover" 
                                        />
                                        <span v-else class="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {{ userForm.name ? userForm.name.charAt(0).toUpperCase() : 'U' }}
                                        </span>
                                        <div v-if="uploadingAvatar" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        </div>
                                    </div>

                                    <div class="flex flex-col space-y-1.5 w-full">
                                        <div class="flex items-center gap-2">
                                            <label class="cursor-pointer px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-xs text-white font-medium rounded-lg border border-slate-700 dark:border-slate-600 transition-colors inline-block text-center shadow-sm">
                                                <span>{{ uploadingAvatar ? 'Subiendo...' : 'Subir imagen' }}</span>
                                                <input 
                                                    ref="fileInputRef" 
                                                    type="file" 
                                                    accept="image/*" 
                                                    class="hidden" 
                                                    :disabled="uploadingAvatar"
                                                    @change="handleAvatarChange" 
                                                />
                                            </label>
                                            <button 
                                                v-if="userForm.avatarUrl" 
                                                type="button" 
                                                :disabled="uploadingAvatar"
                                                @click="removeAvatar"
                                                class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50 font-medium cursor-pointer"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <p class="text-[11px] text-slate-600 dark:text-slate-400">
                                            <span class="text-emerald-600 dark:text-emerald-400 font-medium">Arrastra una imagen</span> o usa el botón (Máx. 2MB).
                                        </p>
                                    </div>
                                </div>                       

                                <div class="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        @click="isUserModalOpen = false"
                                        class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition-colors text-sm cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        :disabled="saving || uploadingAvatar"
                                        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors text-sm cursor-pointer"
                                    >
                                        {{ saving ? 'Guardando...' : (targetUser ? 'Guardar Cambios' : 'Crear Usuario') }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </PageLayout>
        </template>
        ```
14. Vista Vue (`frontend/src/views/admin/RolesAdminView.vue`):
    + Crea el componente `RolesAdminView.vue` para la interfaz de gestión de roles y asignación de permisos:
        ```vue
        <!-- src/views/admin/RolesAdminView.vue -->
        <script setup>
        import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
        import { ref, computed, onMounted } from 'vue';
        import { roleService } from '@/services';
        import { useAuthStore } from '@/stores/auth.store';
        import { getSwalTheme } from '@/utils/swal';
        import PageLayout from '@/components/common/PageLayout.vue';

        // Instancia del store para acceder a los getters
        const authStore = useAuthStore();

        const roles = ref([]);
        const availablePermissions = ref([]);
        const isModalOpen = ref(false);
        const saving = ref(false);
        const targetRole = ref(null);

        const form = ref({
            name: '',
            description: '',
            permissions: []
        });

        // Agrupar permisos por módulo para mostrarlos organizados
        const groupedPermissions = computed(() => {
            return availablePermissions.value.reduce((acc, perm) => {
                if (!acc[perm.module]) acc[perm.module] = [];
                acc[perm.module].push(perm);
                return acc;
            }, {});
        });

        const loadData = async () => {
            try {
                const [rolesRes, permsRes] = await Promise.all([
                    roleService.getRoles(),
                    roleService.getPermissions()
                ]);
                roles.value = rolesRes.data?.roles || rolesRes.roles || [];
                availablePermissions.value = permsRes.data?.permissions || permsRes.permissions || [];
            } catch (err) {
                console.error('Error al cargar datos:', err);
                getSwalTheme().fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los roles y permisos.',
                    icon: 'error'
                });
            }
        };

        const openModal = (role = null) => {
            targetRole.value = role;
            if (role) {
                const rolePerms = Array.isArray(role.permissions) ? role.permissions : [];
                form.value = {
                    name: role.name,
                    description: role.description || '',
                    permissions: rolePerms.map(p => typeof p === 'object' ? p.action : p)
                };
            } else {
                form.value = { name: '', description: '', permissions: [] };
            }
            isModalOpen.value = true;
        };

        const saveRole = async () => {
            saving.value = true;
            try {
                if (targetRole.value) {
                    await roleService.updateRole(targetRole.value.id, form.value);
                } else {
                    await roleService.createRole(form.value);
                }
                isModalOpen.value = false;
                await loadData();
                
                getSwalTheme().fire({
                    title: '¡Guardado!',
                    text: 'El rol ha sido guardado exitosamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                getSwalTheme().fire({
                    title: 'Error',
                    text: err.response?.data?.message || 'Error al guardar el rol',
                    icon: 'error'
                });
            } finally {
                saving.value = false;
            }
        };

        const confirmDelete = async (role) => {
            if (role.name === 'SUPER_ADMIN') {
                getSwalTheme().fire({
                    title: 'Acción No Permitida',
                    text: 'El rol SUPER_ADMIN es un rol de sistema y no puede ser eliminado.',
                    icon: 'error'
                });
                return;
            }

            const isDarkTheme = document.documentElement.classList.contains('dark');
            const result = await getSwalTheme().fire({
                title: '¿Eliminar Rol?',
                html: `Estás a punto de eliminar el rol <strong>${role.name}</strong>.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    popup: isDarkTheme ? 'rounded-xl border border-slate-700 shadow-2xl' : 'rounded-xl border border-slate-200 shadow-2xl',
                    confirmButton: 'px-4 py-2 rounded-lg font-medium text-sm bg-red-600 hover:bg-red-500 text-white transition-colors mr-3',
                    cancelButton: isDarkTheme 
                        ? 'px-4 py-2 rounded-lg font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                        : 'px-4 py-2 rounded-lg font-medium text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors'
                }
            });

            if (result.isConfirmed) {
                try {
                    await roleService.deleteRole(role.id);
                    
                    getSwalTheme().fire({
                        title: '¡Eliminado!',
                        text: 'El rol ha sido eliminado correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    await loadData();
                } catch (err) {
                    getSwalTheme().fire({
                        title: 'Error',
                        text: err.response?.data?.message || 'Error al eliminar el rol',
                        icon: 'error'
                    });
                }
            }
        };

        const getRoleBadgeClass = (name) => {
            switch (name) {
                case 'SUPER_ADMIN': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
                case 'ADMIN': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
                case 'USER': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30';
                default: return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500/30';
            }
        };

        onMounted(() => {
            loadData();
        });
        </script>

        <template>
            <PageLayout 
                title="Gestión de Roles" 
                description="Administra los roles del sistema y configura las acciones permitidas para cada uno."
                :backTo="'/admin'"
                backText="Volver al Panel Admin"
            >
                <!-- Slot de acciones del encabezado -->
                <template #actions>
                    <button 
                        v-if="authStore.hasPermission('roles:create')"
                        @click="openModal()"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-600/30 shrink-0 cursor-pointer"
                    >
                        <PlusIcon class="w-5 h-5" />
                        <span>Nuevo Rol</span>
                    </button>
                </template>

                <!-- Contenido principal: Tabla de Roles -->
                <div class="w-full bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-x-auto shadow-xl">
                    <table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead class="bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th class="px-6 py-3">Nombre del Rol</th>
                                <th class="px-6 py-3">Descripción</th>
                                <th class="px-6 py-3">Usuarios</th>
                                <th class="px-6 py-3">Permisos Asignados</th>
                                <th class="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
                            <tr v-for="role in roles" :key="role.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold border" :class="getRoleBadgeClass(role.name)">
                                        {{ role.name }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{{ role.description || 'Sin descripción' }}</td>
                                <td class="px-6 py-4 text-slate-700 dark:text-slate-300">{{ role.userCount }} usuario(s)</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span 
                                        v-if="role.name === 'SUPER_ADMIN'"
                                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/20"
                                    >
                                        Acceso Total (Global)
                                    </span>
                                    <span 
                                        v-else
                                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600/50"
                                    >
                                        {{ role.permissions ? role.permissions.length : 0 }} permiso(s)
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button 
                                            v-if="authStore.hasPermission('roles:update')"
                                            @click="openModal(role)"
                                            class="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                                            :title="role.name === 'SUPER_ADMIN' ? 'Ver detalles del rol' : 'Editar rol'"
                                        >
                                            <PencilIcon class="w-4 h-4" />
                                        </button>
                                        
                                        <button 
                                            v-if="authStore.hasPermission('roles:delete') && role.name !== 'SUPER_ADMIN'"
                                            @click="confirmDelete(role)"
                                            class="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg transition-colors cursor-pointer"
                                            title="Eliminar rol"
                                        >
                                            <TrashIcon class="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Slot para Modales -->
                <template #modales>
                    <div 
                        v-if="isModalOpen" 
                        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4"
                    >
                        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                            
                            <!-- Header del Modal -->
                            <div class="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ targetRole ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h2>
                                <button type="button" @click="isModalOpen = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 cursor-pointer">✕</button>
                            </div>

                            <!-- Formulario con scroll vertical -->
                            <form @submit.prevent="saveRole" class="flex flex-col flex-1 overflow-hidden min-h-0">
                                
                                <div class="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Nombre del Rol</label>
                                        <input 
                                            v-model="form.name" 
                                            type="text" 
                                            required 
                                            :disabled="targetRole?.name === 'SUPER_ADMIN'"
                                            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                                            placeholder="Ej: EDITOR"
                                        />
                                    </div>

                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Descripción</label>
                                        <input 
                                            v-model="form.description" 
                                            type="text" 
                                            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                            placeholder="Descripción breve de responsabilidades"
                                        />
                                    </div>

                                    <!-- Asignación de Permisos Agrupados -->
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-3">Permisos Asignados</label>
                                        
                                        <div v-if="form.name === 'SUPER_ADMIN'" class="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-xl text-purple-700 dark:text-purple-300 text-xs">
                                            El rol SUPER_ADMIN cuenta con acceso absoluto e irrestricto a todas las funcionalidades del sistema.
                                        </div>
                                        
                                        <div v-else class="space-y-4">
                                            <div v-for="(perms, moduleName) in groupedPermissions" :key="moduleName" class="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                                <h4 class="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-3">{{ moduleName }}</h4>
                                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <label v-for="perm in perms" :key="perm.id" class="flex items-center space-x-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                                        <input 
                                                            type="checkbox" 
                                                            :value="perm.action" 
                                                            v-model="form.permissions"
                                                            class="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                        />
                                                        <span class="break-all font-medium">{{ perm.action }}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Footer con Botones -->
                                <div class="flex justify-end space-x-3 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 shrink-0">
                                    <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                                        {{ targetRole?.name === 'SUPER_ADMIN' ? 'Cerrar' : 'Cancelar' }}
                                    </button>
                                    
                                    <button 
                                        v-if="targetRole?.name !== 'SUPER_ADMIN'"
                                        type="submit" 
                                        :disabled="saving" 
                                        class="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
                                    >
                                        {{ saving ? 'Guardando...' : 'Guardar Rol' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </PageLayout>
        </template>
        ```
15. Creamos la vista `frontend/src/views/admin/AuditLogsView.vue`:
    ```vue
    <!-- src/views/admin/AuditLogsView.vue -->
    <script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { auditService } from '@/services';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    import 'flatpickr/dist/themes/dark.css';
    import { Spanish } from 'flatpickr/dist/l10n/es.js';
    import PageLayout from '@/components/common/PageLayout.vue';

    const logs = ref([]);
    const loading = ref(false);
    const selectedLogModal = ref(null);

    const startDateInput = ref(null);
    const endDateInput = ref(null);
    let fpStart = null;
    let fpEnd = null;

    const filters = ref({
        search: '',
        entity: '',
        startDate: '',
        endDate: '',
    });

    const pagination = ref({
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 1,
    });

    const sortBy = ref('createdAt');
    const sortOrder = ref('desc');

    const handleSort = (field) => {
        if (sortBy.value === field) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortBy.value = field;
            sortOrder.value = 'asc';
        }
        fetchLogs(1);
    };

    const fetchLogs = async (page = 1) => {
        const targetPage = (typeof page === 'number' && !isNaN(page)) ? page : 1;
        
        pagination.value.page = targetPage;
        loading.value = true;

        try {
            const response = await auditService.getAuditLogs({
                page: pagination.value.page,
                limit: pagination.value.limit,
                search: filters.value.search,
                entity: filters.value.entity,
                startDate: filters.value.startDate,
                endDate: filters.value.endDate,
                sortBy: sortBy.value,
                sortOrder: sortOrder.value
            });

            // Extrae la data directo del payload estandarizado del backend
            const resData = response.data || response;
            logs.value = resData.logs || [];
            pagination.value = resData.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 };
        } catch (err) {
            console.error('Error al cargar logs:', err);
            logs.value = [];
        } finally {
            loading.value = false;
        }
    }; 

    let searchTimeout = null;
    const debounceSearch = () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchLogs(1);
        }, 400);
    };

    const changePage = (newPage) => {
        if (newPage < 1 || newPage > pagination.value.totalPages) return;
        fetchLogs(newPage);
    };    

    const openDetailsModal = (log) => {
        selectedLogModal.value = log;
    };

    const getEntityBadgeClass = (entity) => {
        switch (entity) {
            case 'User': return 'bg-blue-500/10 text-emerald-500 border-emerald-500/20';
            case 'Role': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Auth': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-ES', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });
    };

    const formatJsonDetails = (details) => {
        if (!details) return '';
        try {
            const parsed = typeof details === 'string' ? JSON.parse(details) : details;
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return details;
        }
    };

    onMounted(() => {
        fetchLogs();

        const commonConfig = {
            locale: Spanish,
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd/m/Y',
            allowInput: true,
        };

        fpStart = flatpickr(startDateInput.value, {
            ...commonConfig,
            onChange: (selectedDates, dateStr) => {
                filters.value.startDate = dateStr;
                fetchLogs(1);
            },
        });

        fpEnd = flatpickr(endDateInput.value, {
            ...commonConfig,
            onChange: (selectedDates, dateStr) => {
                filters.value.endDate = dateStr;
                fetchLogs(1);
            },
        });
    });

    onUnmounted(() => {
        if (fpStart) fpStart.destroy();
        if (fpEnd) fpEnd.destroy();
    });
    </script>

    <template>
        <PageLayout 
            title="Auditoría del Sistema" 
            description="Historial detallado de actividad y acciones ejecutadas."
            :backTo="'/admin'"
            backText="Volver al Panel Admin"
        >
            <!-- Slot para Botones de Acción (Refrescar) -->
            <template #actions>
                <button 
                    @click="fetchLogs" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-sm font-medium transition-colors w-fit cursor-pointer shadow-sm"
                >
                    <span>Refrescar</span>
                </button>
            </template>

            <!-- Slot para Filtros -->
            <template #filters>
                <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Buscar</label>
                        <input 
                            v-model="filters.search" 
                            @input="debounceSearch"
                            type="text" 
                            placeholder="Acción, usuario, email..." 
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-800 dark:text-slate-200"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Entidad</label>
                        <select 
                            v-model="filters.entity" 
                            @change="fetchLogs(1)"
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-800 dark:text-slate-200"
                        >
                            <option value="">Todas</option>
                            <option value="User">Usuario</option>
                            <option value="Auth">Autenticación</option>
                            <option value="Role">Rol</option>
                            <option value="SystemLog">Sistema</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Desde</label>
                        <input 
                            ref="startDateInput"
                            type="text" 
                            placeholder="Seleccionar fecha..."
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer text-slate-800 dark:text-slate-200"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Hasta</label>
                        <input 
                            ref="endDateInput"
                            type="text" 
                            placeholder="Seleccionar fecha..."
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer text-slate-800 dark:text-slate-200"
                        />
                    </div>
                </div>
            </template>

            <!-- Contenido Principal: Tabla y Paginación -->
            <div class="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider select-none">
                                <th @click="handleSort('createdAt')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Fecha / Hora</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <th @click="handleSort('user')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Usuario</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'user' && sortOrder === 'asc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'user' && sortOrder === 'desc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <th @click="handleSort('action')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Acción</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'action' && sortOrder === 'asc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'action' && sortOrder === 'desc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <th @click="handleSort('entity')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Entidad</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'entity' && sortOrder === 'asc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'entity' && sortOrder === 'desc' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <th class="py-3 px-4 text-left">IP</th>
                                <th class="py-3 px-4 text-right">Detalles</th>
                            </tr>
                        </thead>               
                        <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                            <tr v-if="loading">
                                <td colspan="6" class="text-center py-8 text-slate-500 dark:text-slate-400">Cargando registros...</td>
                            </tr>
                            <tr v-else-if="logs.length === 0">
                                <td colspan="6" class="text-center py-8 text-slate-500 dark:text-slate-400">No se encontraron eventos.</td>
                            </tr>
                            <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td class="py-3 px-4 font-mono text-xs whitespace-nowrap text-slate-600 dark:text-slate-300">{{ formatDate(log.createdAt) }}</td>
                                <td class="py-3 px-4">
                                    <div v-if="log.user" class="flex flex-col">
                                        <span class="font-medium text-slate-900 dark:text-white">{{ log.user.name }}</span>
                                        <span class="text-xs text-slate-500 dark:text-slate-400">{{ log.user.email }}</span>
                                    </div>
                                    <span v-else class="text-xs text-slate-500 dark:text-slate-400 italic">Sistema / Anónimo</span>
                                </td>
                                <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{{ log.action }}</td>
                                <td class="py-3 px-4">
                                    <span :class="getEntityBadgeClass(log.entity)" class="px-2.5 py-1 text-[11px] font-semibold rounded-lg border">
                                        {{ log.entity }}
                                    </span>
                                </td>
                                <td class="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">{{ log.ipAddress || 'N/A' }}</td>
                                <td class="py-3 px-4 text-right">
                                    <button 
                                        v-if="log.details" 
                                        @click="openDetailsModal(log)" 
                                        class="text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-medium cursor-pointer"
                                    >
                                        Ver JSON
                                    </button>
                                    <span v-else class="text-xs text-slate-400">-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Paginación -->
                <div class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700">
                    <span class="text-xs text-slate-600 dark:text-slate-400">
                        Mostrando página {{ pagination.page }} de {{ pagination.totalPages }} ({{ pagination.total }} registros)
                    </span>
                    <div class="flex gap-2">
                        <button 
                            :disabled="pagination.page <= 1" 
                            @click="changePage(pagination.page - 1)" 
                            class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                            Anterior
                        </button>
                        <button 
                            :disabled="pagination.page >= pagination.totalPages" 
                            @click="changePage(pagination.page + 1)" 
                            class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            <!-- Slot para Modales -->
            <template #modales>
                <!-- Modal de Detalles JSON -->
                <div v-if="selectedLogModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <div class="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-1">
                            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Detalles del Evento</h3>
                            <span class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{ selectedLogModal.action }} - {{ formatDate(selectedLogModal.createdAt) }}</span>
                        </div>    
                        <div class="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-y-auto overflow-x-hidden max-h-[50vh] max-w-full">
                            <pre class="text-yellow-600 dark:text-yellow-400 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed select-all">{{ formatJsonDetails(selectedLogModal.details) }}</pre>
                        </div>
                        <div class="flex justify-end">
                            <button 
                                @click="selectedLogModal = null" 
                                class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </PageLayout>
    </template>
    ```
16. Creamos la vista `frontend/src/views/admin/SystemDiagnosticView.vue`:
    ```vue
    <!-- src/views/admin/SystemDiagnosticView.vue -->
    <script setup>
    import { computed, onMounted } from 'vue';
    import { useDiagnosticStore } from '@/stores/diagnostic.store';
    import { SparklesIcon } from '@heroicons/vue/24/outline';
    import PageLayout from '@/components/common/PageLayout.vue';

    const diagnosticStore = useDiagnosticStore();

    const formattedTimestamp = computed(() => {
        if (!diagnosticStore.timestamp) return '';
        const date = new Date(diagnosticStore.timestamp);
        return date.toLocaleString();
    });

    onMounted(async () => {
        await diagnosticStore.fetchDiagnostic(false);
    });

    const handleRefresh = async () => {
        await diagnosticStore.fetchDiagnostic(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'text-emerald-600 dark:text-emerald-400';
            case 'warning': return 'text-amber-600 dark:text-amber-400';
            case 'critical': return 'text-rose-600 dark:text-rose-400';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };

    const getSecurityColor = (status) => {
        switch (status) {
            case 'secure': return 'text-emerald-600 dark:text-emerald-400';
            case 'suspicious': return 'text-amber-600 dark:text-amber-400';
            case 'compromised': return 'text-rose-600 dark:text-rose-400';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };
    </script>

    <template>
        <PageLayout 
            title="Diagnóstico del Sistema por IA" 
            description="Análisis inteligente del estado global, salud y seguridad de la aplicación."
            :backTo="'/admin'"
            backText="Volver al Panel Admin"
        >
            <!-- Slot para Botones de Acción (Generar Nuevo Diagnóstico) -->
            <template #actions>
                <button 
                    @click="handleRefresh" 
                    :disabled="diagnosticStore.loading"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                >
                    <span v-if="diagnosticStore.loading" class="animate-spin text-lg">⏳</span>
                    <SparklesIcon v-else class="w-5 h-5" />
                    <span>{{ diagnosticStore.loading ? 'Analizando infraestructura...' : 'Generar Nuevo Diagnóstico' }}</span>
                </button>
            </template>

            <!-- Contenido Principal -->
            <div class="space-y-6">
                <!-- Error Banner -->
                <div v-if="diagnosticStore.error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center space-x-3 shadow-lg">
                    <ExclamationTriangleIcon class="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                    <p class="text-sm">{{ diagnosticStore.error }}</p>
                </div>

                <!-- Timestamp de última consulta -->
                <div v-if="diagnosticStore.timestamp" class="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl flex items-center justify-between text-sm backdrop-blur-sm shadow-sm">
                    <span class="text-slate-500 dark:text-slate-400">Último diagnóstico generado: <strong class="text-slate-900 dark:text-slate-200">{{ formattedTimestamp }}</strong></span>
                </div>

                <!-- Report Container -->
                <div v-if="diagnosticStore.report" class="space-y-6">
                    <!-- Tarjetas de Estado General -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Global</span>
                            <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.globalStatus)">
                                {{ diagnosticStore.report.globalStatus }}
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Backend</span>
                            <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.backendStatus)">
                                {{ diagnosticStore.report.backendStatus }}
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Frontend</span>
                            <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.frontendStatus)">
                                {{ diagnosticStore.report.frontendStatus }}
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Base de Datos</span>
                            <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.databaseStatus)">
                                {{ diagnosticStore.report.databaseStatus }}
                            </div>
                        </div>
                        <div class="col-span-2 sm:col-span-1 bg-white dark:bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Seguridad</span>
                            <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getSecurityColor(diagnosticStore.report.securityStatus)">
                                {{ diagnosticStore.report.securityStatus }}
                            </div>
                        </div>
                    </div>

                    <!-- Resumen Ejecutivo -->
                    <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 backdrop-blur-sm">
                        <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <DocumentTextIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Resumen Ejecutivo
                        </h2>
                        <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{{ diagnosticStore.report.summary }}</p>
                    </div>

                    <!-- Detalles por Componente y Recomendaciones -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Análisis Detallado -->
                        <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 backdrop-blur-sm flex flex-col">
                            <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <CpuChipIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                Análisis Detallado
                            </h3>
                            <ul class="space-y-3 text-sm text-slate-700 dark:text-slate-300 flex-1">
                                <li class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/40">
                                    <strong class="text-slate-900 dark:text-white block mb-0.5">Backend:</strong> 
                                    <span class="text-slate-600 dark:text-slate-300">{{ diagnosticStore.report.details.backend }}</span>
                                </li>
                                <li class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/40">
                                    <strong class="text-slate-900 dark:text-white block mb-0.5">Frontend:</strong> 
                                    <span class="text-slate-600 dark:text-slate-300">{{ diagnosticStore.report.details.frontend }}</span>
                                </li>
                                <li class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/40">
                                    <strong class="text-slate-900 dark:text-white block mb-0.5">Base de Datos:</strong> 
                                    <span class="text-slate-600 dark:text-slate-300">{{ diagnosticStore.report.details.database }}</span>
                                </li>
                                <li class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/40">
                                    <strong class="text-slate-900 dark:text-white block mb-0.5">Seguridad:</strong> 
                                    <span class="text-slate-600 dark:text-slate-300">{{ diagnosticStore.report.details.security }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Recomendaciones de Acción -->
                        <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/60 backdrop-blur-sm flex flex-col">
                            <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <CheckCircleIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                Recomendaciones de Acción
                            </h3>
                            <ul class="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 flex-1">
                                <li v-for="(rec, index) in diagnosticStore.report.recommendations" :key="index" class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/40">
                                    <span class="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-xs w-5 h-5 rounded-full shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-500/20">
                                        {{ index + 1 }}
                                    </span>
                                    <span class="leading-relaxed">{{ rec }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    </template>
    ```
17. Crear Vista 404 (not-found):
    + Crea el archivo `frontend/src/views/errors/NotFoundView.vue`:
        ```vue
        <template>
            <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl font-black text-emerald-500 mb-2">404</h1>
                <h2 class="text-2xl font-bold mb-4">Página no encontrada</h2>
                <p class="text-slate-400 mb-6 max-w-md">
                    La ruta a la que intentas acceder no existe o ha sido movida a otro lugar.
                </p>
                <router-link
                    to="/"
                    class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-emerald-400 font-medium transition-colors"
                >
                    Volver al Inicio
                </router-link>
            </div>
        </template>        
        ```
18. Crear Vista 403 (forbidden):
    + Crea el archivo `frontend/src/views/errors/ForbiddenView.vue`:
        ```vue
        <template>
            <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
                <!-- Ícono decorativo o código HTTP -->
                <h1 class="text-8xl font-black text-rose-500 mb-2">403</h1>
                <h2 class="text-2xl font-bold mb-4">Acceso Restringido</h2>
                <p class="text-slate-400 mb-6 max-w-md">
                    No tienes los permisos necesarios para acceder a esta página. Si crees que se trata de un error, por favor contacta con el administrador del sistema.
                </p>
                
                <div class="flex gap-4">
                    <router-link
                        to="/dashboard"
                        class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 font-medium transition-colors"
                    >
                        Ir al Dashboard
                    </router-link>
                    
                    <router-link
                        to="/"
                        class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors"
                    >
                        Ir al Inicio
                    </router-link>
                </div>
            </div>
        </template>       
        ```
