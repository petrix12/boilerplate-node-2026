<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <!-- Encabezado y Contenedor Superior -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <!-- Botón de retorno al Panel Admin -->
            <div class="mb-5">
                <router-link 
                    to="/admin" 
                    class="inline-flex items-center space-x-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors group"
                >
                    <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al Panel Admin</span>
                </router-link>
            </div>

            <!-- Título y Acciones -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Diagnóstico del Sistema por IA</h1>
                    <p class="text-slate-400 text-sm mt-1">Análisis inteligente del estado global, salud y seguridad de la aplicación.</p>
                </div>
                <button 
                    @click="handleRefresh" 
                    :disabled="diagnosticStore.loading"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                >
                    <span v-if="diagnosticStore.loading" class="animate-spin text-lg">⏳</span>
                    <SparklesIcon v-else class="w-5 h-5" />
                    <span>{{ diagnosticStore.loading ? 'Analizando infraestructura...' : 'Generar Nuevo Diagnóstico' }}</span>
                </button>
            </div>
        </div>

        <!-- Error Banner -->
        <div v-if="diagnosticStore.error" class="bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-xl flex items-center space-x-3 shadow-lg">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-400 shrink-0" />
            <p class="text-sm">{{ diagnosticStore.error }}</p>
        </div>

        <!-- Timestamp de última consulta -->
        <div v-if="diagnosticStore.timestamp" class="bg-slate-800/30 border border-slate-700/60 text-slate-300 px-4 py-3 rounded-xl flex items-center justify-between text-sm backdrop-blur-sm">
            <span class="text-slate-400">Último diagnóstico generado: <strong class="text-slate-200">{{ formattedTimestamp }}</strong></span>
        </div>

        <!-- Report Container -->
        <div v-if="diagnosticStore.report" class="space-y-6">
            <!-- Tarjetas de Estado General -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div class="bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-700/60 flex flex-col justify-between">
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global</span>
                    <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.globalStatus)">
                        {{ diagnosticStore.report.globalStatus }}
                    </div>
                </div>
                <div class="bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-700/60 flex flex-col justify-between">
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backend</span>
                    <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.backendStatus)">
                        {{ diagnosticStore.report.backendStatus }}
                    </div>
                </div>
                <div class="bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-700/60 flex flex-col justify-between">
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Frontend</span>
                    <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.frontendStatus)">
                        {{ diagnosticStore.report.frontendStatus }}
                    </div>
                </div>
                <div class="bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-700/60 flex flex-col justify-between">
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Base de Datos</span>
                    <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getStatusColor(diagnosticStore.report.databaseStatus)">
                        {{ diagnosticStore.report.databaseStatus }}
                    </div>
                </div>
                <div class="col-span-2 sm:col-span-1 bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-700/60 flex flex-col justify-between">
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seguridad</span>
                    <div class="text-base sm:text-lg font-bold capitalize mt-2" :class="getSecurityColor(diagnosticStore.report.securityStatus)">
                        {{ diagnosticStore.report.securityStatus }}
                    </div>
                </div>
            </div>

            <!-- Resumen Ejecutivo -->
            <div class="bg-slate-800/60 p-6 rounded-2xl shadow-md border border-slate-700/60 backdrop-blur-sm">
                <h2 class="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <DocumentTextIcon class="w-5 h-5 text-indigo-400" />
                    Resumen Ejecutivo
                </h2>
                <p class="text-slate-300 leading-relaxed text-sm">{{ diagnosticStore.report.summary }}</p>
            </div>

            <!-- Detalles por Componente y Recomendaciones -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Análisis Detallado -->
                <div class="bg-slate-800/60 p-6 rounded-2xl shadow-md border border-slate-700/60 backdrop-blur-sm flex flex-col">
                    <h3 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
                        <CpuChipIcon class="w-5 h-5 text-indigo-400" />
                        Análisis Detallado
                    </h3>
                    <ul class="space-y-3 text-sm text-slate-300 flex-1">
                        <li class="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                            <strong class="text-white block mb-0.5">Backend:</strong> 
                            <span class="text-slate-300">{{ diagnosticStore.report.details.backend }}</span>
                        </li>
                        <li class="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                            <strong class="text-white block mb-0.5">Frontend:</strong> 
                            <span class="text-slate-300">{{ diagnosticStore.report.details.frontend }}</span>
                        </li>
                        <li class="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                            <strong class="text-white block mb-0.5">Base de Datos:</strong> 
                            <span class="text-slate-300">{{ diagnosticStore.report.details.database }}</span>
                        </li>
                        <li class="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                            <strong class="text-white block mb-0.5">Seguridad:</strong> 
                            <span class="text-slate-300">{{ diagnosticStore.report.details.security }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Recomendaciones de Acción -->
                <div class="bg-slate-800/60 p-6 rounded-2xl shadow-md border border-slate-700/60 backdrop-blur-sm flex flex-col">
                    <h3 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
                        <CheckCircleIcon class="w-5 h-5 text-indigo-400" />
                        Recomendaciones de Acción
                    </h3>
                    <ul class="space-y-2.5 text-sm text-slate-300 flex-1">
                        <li v-for="(rec, index) in diagnosticStore.report.recommendations" :key="index" class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                            <span class="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 font-bold text-xs w-5 h-5 rounded-full shrink-0 mt-0.5 border border-indigo-500/20">
                                {{ index + 1 }}
                            </span>
                            <span class="leading-relaxed">{{ rec }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDiagnosticStore } from '@/stores/diagnostic.store';
import { ChevronLeftIcon, SparklesIcon } from '@heroicons/vue/24/outline';

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
        case 'healthy': return 'text-emerald-400';
        case 'warning': return 'text-amber-400';
        case 'critical': return 'text-rose-400';
        default: return 'text-slate-400';
    }
};

const getSecurityColor = (status) => {
    switch (status) {
        case 'secure': return 'text-emerald-400';
        case 'suspicious': return 'text-amber-400';
        case 'compromised': return 'text-rose-400';
        default: return 'text-slate-400';
    }
};
</script>