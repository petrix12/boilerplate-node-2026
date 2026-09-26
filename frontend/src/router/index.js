import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Inicio' } },
        { path: '/login', name: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { requiresGuest: true, title: 'Iniciar Sesión' } },
        { path: '/register', name: 'register', component: () => import('@/views/auth/RegisterView.vue'), meta: { requiresGuest: true, title: 'Registro' } },
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