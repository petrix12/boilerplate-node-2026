# A mano
---

## --------------------------------------------------------        
## 📱 Credenciales en Redes Sociales
### GitHub
### Microsoft (Microsoft Entra ID / Outlook / Azure).
### Apple (Sign in with Apple).
### Meta (Facebook Login) / Instagram.
### X (antes Twitter) / LinkedIn.


## -------------------------------
#### Frontend
1. Home:
    + Dev:  `http://localhost:5173`
    + Prod: `https://familytree2026.vercel.app`
2. Prueba de Registro:
    + Dev:  `http://localhost:5173/register`
    + Prod: `https://familytree2026.vercel.app/register`
3. Prueba de Vista Protegida:
    + Dev:  `http://localhost:5173/dashboard`
    + Prod: `https://familytree2026.vercel.app/dashboard`
4. Prueba de Rehidratación de Sesión (Persistence):
    + Presiona F5 (Recargar página). El Navigation Guard debe ejecutar `fetchUser()`, validar el token contra el endpoint GET `/me` y mantenerte en `/dashboard` sin cerrar tu sesión.
5. Prueba de Cierre de Sesión:
    + Haz clic en el botón Cerrar Sesión. Debe limpiar el localStorage, borrar el usuario de Pinia y redirigirte a `/login`.
6. Prueba de Protección de Rutas:
    + Estando deslogueado, intenta escribir manualmente `http://localhost:5173/dashboard` en la barra de direcciones. El Navigation Guard debe rebotarte de inmediato a `/login`.



## A mano
1. **Docker**:
    + Ver todos los logs:
        ```bash
        docker compose logs -f
        ```
    + Ver solo los logs de servicios específicos (ej. Backend y Frontend):
        ```bash
        docker compose logs -f backend frontend
        ```
    + Ver las últimas N líneas de logs (ej. 50 líneas por servicio) y seguir escuchando:
        ```bash
        docker compose logs -f --tail=50
        ```
    + Resetear base de datos
        ```bash
        docker compose exec backend npx prisma migrate reset --force
        # o en su forma definida en el package.json
        docker compose exec backend npm run db:reset
        ```
    + Evitar el inicio de un contenedor:
        ```bash
        docker update --restart=no nombre_contenedor
        ```
2. **Ubuntu**:
    + Ver estructura de carpetas sin las carpetas node_modules ni archivo ocultos
        ```bash
        tree --dirsfirst -I "node_modules|vendor|.git|temporal|uploads|migrations|borrador.md"
        ```
        + Instalación de tree en sistemas basados en Red Hat / Fedora / CentOS:
            ```bash
            sudo apt update && sudo apt install tree
            ```

## Tares
### Pendientes
+ ◻️ Establecer politicas de seguridad en tablas de base de datos de supabase.
+ ◻️ Multi-idiomas.
+ ◻️ Revisar la seguridad del backend.
+ ◻️ Seguridad y Hardening HTTP (Backend): helmet para configurar cabeceras HTTP seguras. | 
+ ◻️ Seguridad y Hardening HTTP (Backend): express-rate-limit para prevención de ataques de fuerza bruta en rutas críticas (/login, /register, /forgot-password).
+ ◻️ Seguridad y Hardening HTTP (Backend): Desinfección de entrada contra inyecciones SQL / XSS y sanitización de payloads JSON.
+ ◻️ Documentación & CI/CD (Swagger, .env.example, pruebas unitarias básicas).
+ ◻️ Realizar pruebas unitarias.
+ ◻️ Asegurar que los endpoints en el backend se puedan ejecutar según los permisos que les corresponde.
+ ◻️ Indicar la creación de los archivos README.md y LICENSE
+ ◻️ Ajustar detalles en subidas de avatar (que el backend y el frontend soliciten el mismo peso, mensajes más claros).
+ ◻️ Login con redes sociales.
    + ✅ Google (OAuth 2.0 / OpenID Connect).
    + ◻️ GitHub.
    + ◻️ Microsoft (Microsoft Entra ID / Outlook / Azure).
    + ◻️ Apple (Sign in with Apple).
    + ◻️ Meta (Facebook Login) / Instagram.
    + ◻️ X (antes Twitter) / LinkedIn.


### Terminadas
+ ✅ Dockerización.
+ ✅ Refactorización de rutas y controladores en el backend.
+ ✅ Adecuar la aplicación para que sea mas general, por ejemplo cambiar familytree2026-backend por backend, adaptar la vista del home, etc.
+ ✅ CRUD avatars en User Admin.
+ ✅ Refactorizar para acceder a las vistas administrativas con permisos y no con roles.
+ ✅ Homologar vistas admin.
+ ✅ Diagnóstico de la aplicación con IA.
+ ✅ Drag and Drop para gestionar archivos.
+ ✅ Que aparezca la manito cuando el maouse se posicione sobre un botón, o algo por el estilo.
+ ✅ Incluir ruta de documentación (Variable de entorno APP_DOC_VITEPRESS y agregrar enlace en la app.).
+ ✅ Verificar si es necesario variable de entorno IA_ACTIVE.
+ ✅ Personalizar el heder de la página principal (Protocolo Open Graph).
+ ✅ Colocar la opción de mostrar password en login, register y en donde aplique.
+ ✅ Limpiar proyecto frontend de archivos que no se usan.
+ ✅ Implementar mensaje sweetalert en todos los lugares que haga falta.
+ ✅ Si el usuario ya esta registrado que no le permita registrarse otra vez, sino que lo notifique y lo mande al login.
+ ✅ Modalidad modo oscuro y modo claro.
+ ✅ Solicitar autenticación de email.
+ ✅ Crear backend/.env.example y frontend/.env.example
+ ✅ Recuperar credenciales (¿Olvidó su password?).
+ ✅ Mejorar el layout.
+ ✅ Homologar tablas en vistas.
+ ✅ Homologar los modales.
+ ✅ Crear plantillas para las vistas y crear componentes para que las vistas no sean tan grandes.
+ ✅ Homologar nombres de variables de entorno.
+ ✅ Ayudante IA para la aplicación, que se puede meter en la documentación.
+ ✅ Poner modo oscuro por defecto y ver como mejorar el footer.
+ ✅ Pedir repetir contraseña tanto en el register como en el profile.




PORT 		    por 	APP_PORT
NODE_ENV	    por 	APP_ENV
DATABASE_URL    por     DB_URL
DIRECT_URL      por     DB_DIRECT_URL

## Estructura del proyecto
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src
│   │   ├── config
│   │   │   ├── prisma.js
│   │   │   └── s3.js
│   │   ├── controllers
│   │   │   ├── audit.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── diagnostic.controller.js
│   │   │   ├── googleAuth.controller.js
│   │   │   ├── profile.controller.js
│   │   │   ├── role.controller.js
│   │   │   ├── systemLog.controller.js
│   │   │   └── user.controller.js
│   │   ├── middlewares
│   │   │   ├── auditContext.middleware.js
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── googleEnabled.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── routes
│   │   │   ├── audit.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── diagnostic.routes.js
│   │   │   ├── googleAuth.routes.js
│   │   │   ├── index.js
│   │   │   ├── role.routes.js
│   │   │   ├── systemLog.routes.js
│   │   │   └── user.routes.js
│   │   ├── seeders
│   │   │   ├── audit.seeder.js
│   │   │   ├── role-permission.seeder.js
│   │   │   ├── superadmin.seeder.js
│   │   │   └── users.seeder.js
│   │   ├── services
│   │   │   ├── ai.service.js
│   │   │   ├── audit.service.js
│   │   │   ├── cron.service.js
│   │   │   ├── diagnosticAggregator.service.js
│   │   │   ├── googleAuth.service.js
│   │   │   └── systemLog.service.js
│   │   ├── tests
│   │   │   ├── app.test.js
│   │   │   └── auth.test.js
│   │   ├── utils
│   │   │   └── request.utils.js
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── nodemon.json
│   ├── package-lock.json
│   └── package.json
├── docs
│   ├── docs
│   │   ├── public
│   │   │   └── favicon.ico
│   │   ├── index.md
│   │   └── doc_inicial.md
│   ├── package-lock.json
│   └── package.json
├── frontend
│   ├── public
│   │   ├── favicon.ico
│   │   └── logo.png
│   ├── src
│   │   ├── api
│   │   │   └── axios.js
│   │   ├── assets
│   │   │   ├── base.css
│   │   │   └── main.css
│   │   ├── components
│   │   │   ├── auth
│   │   │   │   └── GoogleAuthButton.vue
│   │   │   ├── icons
│   │   │   └── Navbar.vue
│   │   ├── layouts
│   │   │   └── AppLayout.vue
│   │   ├── router
│   │   │   └── index.js
│   │   ├── services
│   │   │   ├── audit.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── ai.service.js
│   │   │   ├── index.js
│   │   │   ├── role.service.js
│   │   │   └── user.service.js
│   │   ├── stores
│   │   │   ├── auth.store.js
│   │   │   └── ai.store.js
│   │   ├── views
│   │   │   ├── admin
│   │   │   │   ├── AdminDashboardView.vue
│   │   │   │   ├── AuditLogsView.vue
│   │   │   │   ├── RolesAdminView.vue
│   │   │   │   ├── SystemDiagnosticView.vue
│   │   │   │   └── UsersAdminView.vue
│   │   │   ├── errors
│   │   │   │   ├── ForbiddenView.vue
│   │   │   │   └── NotFoundView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── HomeView.vue
│   │   │   ├── LoginView.vue
│   │   │   ├── ProfileView.vue
│   │   │   └── RegisterView.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── Dockerfile
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
├── nginx
│   └── default.conf
├── LICENSE
├── README.md
└── docker-compose.yml

---

Bien, te voy a pasar a estos tres juntos, pense que verias algún sospechos en el backend, pero parece que no

frontend/src/layouts/AppLayout.vue:
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import Navbar from '@/components/Navbar.vue';
import AIChatWidget from '@/components/common/AIChatWidget.vue';

const route = useRoute();
const authStore = useAuthStore();

// Extrae el título definido en los meta de la ruta actual
const pageTitle = computed(() => route.meta.title || 'Dashboard');

// Verificamos si la funcionalidad de IA está activa en el sistema/usuario
const isAiActive = computed(() => authStore.aiDiagnosticActive);
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

        <!-- Widget Flotante de IA integrado globalmente -->
        <AIChatWidget v-if="isAiActive" />
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

frontend/src/stores/auth.store.js:
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

frontend/src/router/index.js:
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
                    path: 'admin/system-diagnostic',
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