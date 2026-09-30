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