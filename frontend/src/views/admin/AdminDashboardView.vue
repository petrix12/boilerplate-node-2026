<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <div class="p-6 max-w-7xl mx-auto">        
            <!-- Botón de retorno al Dashboard Principal -->
            <div class="mb-6">
                <router-link 
                    to="/dashboard" 
                    class="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                    <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al Dashboard</span>
                </router-link>
            </div>        
            <div class="mb-8">
                <p class="text-slate-400 text-sm">Gestiona la configuración global de la plataforma, accesos y permisos.</p>
            </div>

            <!-- Grid de Accesos Directos a Módulos Admin -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- Módulo: Usuarios -->
                <router-link 
                    to="/admin/users" 
                    class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                            <UsersIcon class="w-6 h-6" />
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Activo</span>
                    </div>
                    <h2 class="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">Gestión de Usuarios</h2>
                    <p class="text-slate-400 text-xs mt-1">Creación, edición de datos personales, asignación de roles y eliminación.</p>
                </router-link>

                <!-- Módulo: Roles y Permisos -->
                <router-link 
                    to="/admin/roles" 
                    class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-purple-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                            <ShieldCheckIcon class="w-6 h-6" />
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">Dev / Config</span>
                    </div>
                    <h2 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">Roles y Permisos</h2>
                    <p class="text-slate-400 text-xs mt-1">Administración de la tabla de roles globales del sistema (CRUD de Roles).</p>
                </router-link>

                <!-- Módulo: Logs de Auditoría / Sistema -->
                <router-link 
                    to="/admin/audit-logs" 
                    class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl group-hover:scale-110 transition-transform">
                            <DocumentChartBarIcon class="w-6 h-6" />
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">Sistema</span>
                    </div>
                    <h2 class="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">Auditoría / Logs</h2>
                    <p class="text-slate-400 text-xs mt-1">Historial de cambios críticos y acciones de los administradores.</p>
                </router-link>            

            </div>
        </div>
    </div>
</template>

<script setup>
    import { ChevronLeftIcon, UsersIcon, ShieldCheckIcon, DocumentChartBarIcon } from '@heroicons/vue/24/outline';
</script>