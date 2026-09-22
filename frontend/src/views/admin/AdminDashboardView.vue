<template>
    <div class="max-w-7xl mx-auto p-6 space-y-6">
        <!-- Header / Tarjeta de Encabezado con Botón de Retorno -->
        <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
            <div>
                <router-link 
                    to="/dashboard" 
                    class="inline-flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors group"
                >
                    <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al Dashboard</span>
                </router-link>
            </div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Panel de Administración</h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Gestiona la configuración global de la plataforma, accesos y permisos.</p>
                </div>
            </div>
        </div>

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
    </div>
</template>

<script setup>
    import { computed, onMounted } from 'vue';
    import { useAuthStore } from '@/stores/auth.store';
    import { ChevronLeftIcon, UsersIcon, ShieldCheckIcon, DocumentChartBarIcon, CpuChipIcon } from '@heroicons/vue/24/outline';

    const authStore = useAuthStore();

    // Aseguramos que si por alguna razón el user no está completo al entrar, se consulte al backend
    onMounted(async () => {
        if (authStore.token && (!authStore.user || !authStore.user.hasOwnProperty('aiDiagnostic'))) {
            await authStore.fetchUser();
        }
    });

    const isAiActive = computed(() => authStore.aiDiagnosticActive);
</script>