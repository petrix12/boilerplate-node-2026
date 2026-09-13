import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { requiresGuest: true } },
        { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { requiresGuest: true } },
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
                    meta: { title: 'Panel de Administración', requiresRole: 'SUPER_ADMIN' } 
                },
                {
                    path: 'admin/users',
                    name: 'admin-users',
                    component: () => import('@/views/admin/UsersAdminView.vue'),
                    meta: { title: 'Gestión de Usuarios', requiresRole: 'SUPER_ADMIN' }
                },
                { 
                    path: '/admin/roles', 
                    name: 'admin-roles', 
                    component: () => import('@/views/admin/RolesAdminView.vue'), 
                    meta: { title: 'Roles y Permisos', requiresRole: 'SUPER_ADMIN' } 
                },
                { 
                    path: '/admin/audit-logs', 
                    name: 'admin-audit-logs', 
                    component: () => import('@/views/admin/AuditLogsView.vue'), 
                    meta: { title: 'Registros de Auditoría', requiresRole: 'SUPER_ADMIN' } 
                },               
            ]
        },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },  
    ],
});

// Navigation Guard Global
router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    if (authStore.token && !authStore.user) {
        await authStore.fetchUser();
    }

    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'login' };
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        return { name: 'dashboard' };
    }

    // Validación de Rol para rutas de administración
    if (to.meta.requiresRole) {
        const userRoles = authStore.user?.roles || [];
            if (!userRoles.includes(to.meta.requiresRole)) {
            return { name: 'dashboard' }; // Redirige al dashboard si no posee el rol
        }
    }

    return true;
});

export default router;