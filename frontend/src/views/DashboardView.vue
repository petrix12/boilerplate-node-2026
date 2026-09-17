<script setup>
    import { computed } from 'vue';
    import { useAuthStore } from '../stores/auth.store';
    import { 
        ShieldCheckIcon, 
        UserCircleIcon, 
        CommandLineIcon, 
        CpuChipIcon, 
        ArrowRightIcon,
        ServerIcon,
        CheckCircleIcon
    } from '@heroicons/vue/24/outline';

    const authStore = useAuthStore();

    // Verificamos si el usuario tiene rol de administrador o dev
    const isAdmin = computed(() => {
        return authStore.userRoles?.some(role => ['admin', 'super-admin', 'Developer'].includes(role));
    });
</script>

<template>
    <div class="max-w-7xl mx-auto p-6 space-y-6">
        <!-- Banner de Bienvenida / Perfil Resumido -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/60 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold shadow-inner">
                    {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-2xl font-bold text-white">¡Hola, {{ authStore.user?.name }}!</h1>
                        <span class="flex h-2 w-2 relative">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </div>
                    <p class="text-sm text-slate-400 mt-0.5">{{ authStore.user?.email }}</p>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <span 
                    v-for="role in authStore.userRoles" 
                    :key="role"
                    class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1.5"
                >
                    <ShieldCheckIcon class="w-4 h-4" />
                    {{ role }}
                </span>
            </div>
        </div>

        <!-- Métricas Rápidas / Stack Info (Demuestra dominio técnico) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
                <div class="p-3 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl">
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
                <div class="p-3 bg-purple-500/10 text-purple-500 dark:text-purple-400 rounded-xl">
                    <CommandLineIcon class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Arquitectura</p>
                    <p class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Modular / REST</p>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
                <div class="p-3 bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 rounded-xl">
                    <CpuChipIcon class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Seguridad Auth</p>
                    <p class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">JWT / Sanctum</p>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
                <div class="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl">
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
            <div v-if="isAdmin" class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                    <span class="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">Zona Restringida</span>
                    <h2 class="text-xl font-bold text-white mt-3">Panel de Administración</h2>
                    <p class="text-slate-400 text-xs mt-1 leading-relaxed">
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
                    <span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">Boilerplate Ready</span>
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-3">Explora el Código y Estructura</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                        Este entorno demuestra buenas prácticas de desarrollo Full-Stack, separación de responsabilidades, componentes reutilizables y diseño responsivo.
                    </p>
                </div>
                <div class="flex items-center gap-3 pt-2">
                    <span class="text-xs text-slate-400 font-mono">Vue 3 + Tailwind CSS + Pinia</span>
                </div>
            </div>
        </div>
    </div>
</template>