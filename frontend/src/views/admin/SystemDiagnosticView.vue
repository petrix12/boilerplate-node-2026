<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center">
        <div class="p-6 w-full max-w-7xl mx-auto space-y-6">
            <!-- Encabezado y Contenedor Superior -->
            <div class="bg-slate-800/40 border border-slate-700/60 rounded-2xl px-6 py-6 shadow-xl">
                <!-- Botón de retorno al Panel Admin -->
                <div class="mb-6">
                    <router-link 
                        to="/admin" 
                        class="inline-flex items-center space-x-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
                    >
                        <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Panel Admin</span>
                    </router-link>
                </div>

                <!-- Encabezado y Acciones -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 class="text-xl font-bold text-white">Diagnóstico del Sistema por IA</h1>
                        <p class="text-slate-400 text-sm mt-1">Análisis inteligente del estado global, salud y seguridad de la aplicación.</p>
                    </div>
                    <button 
                        @click="handleRefresh" 
                        :disabled="diagnosticStore.loading"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                    >
                        <span v-if="diagnosticStore.loading" class="animate-spin">⏳</span>
                        <span v-else><SparklesIcon class="w-5 h-5" /></span>
                        {{ diagnosticStore.loading ? 'Analizando infraestructura...' : 'Generar Nuevo Diagnóstico' }}
                    </button>
                </div>
            </div>

            <!-- Error Banner -->
            <div v-if="diagnosticStore.error" class="bg-red-900/40 border-l-4 border-red-500 text-red-300 p-4 rounded-xl">
                <p>{{ diagnosticStore.error }}</p>
            </div>

            <!-- Visualización de la fecha y hora de la última consulta -->
            <div v-if="diagnosticStore.timestamp" class="bg-indigo-950/40 border-l-4 border-indigo-500 text-indigo-300 p-4 rounded-xl flex items-center justify-between">
                <span class="text-sm">Último diagnóstico generado el: <strong class="text-white">{{ formattedTimestamp }}</strong></span>
            </div>

            <!-- Report Container -->
            <div v-if="diagnosticStore.report" class="space-y-6">
                <!-- Tarjetas de Estado General -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div class="bg-slate-800/60 p-4 rounded-2xl shadow border border-slate-700/60">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global</span>
                        <div class="text-lg font-bold capitalize mt-1" :class="getStatusColor(diagnosticStore.report.globalStatus)">
                            {{ diagnosticStore.report.globalStatus }}
                        </div>
                    </div>
                    <div class="bg-slate-800/60 p-4 rounded-2xl shadow border border-slate-700/60">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backend</span>
                        <div class="text-lg font-bold capitalize mt-1" :class="getStatusColor(diagnosticStore.report.backendStatus)">
                            {{ diagnosticStore.report.backendStatus }}
                        </div>
                    </div>
                    <div class="bg-slate-800/60 p-4 rounded-2xl shadow border border-slate-700/60">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Frontend</span>
                        <div class="text-lg font-bold capitalize mt-1" :class="getStatusColor(diagnosticStore.report.frontendStatus)">
                            {{ diagnosticStore.report.frontendStatus }}
                        </div>
                    </div>
                    <div class="bg-slate-800/60 p-4 rounded-2xl shadow border border-slate-700/60">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Base de Datos</span>
                        <div class="text-lg font-bold capitalize mt-1" :class="getStatusColor(diagnosticStore.report.databaseStatus)">
                            {{ diagnosticStore.report.databaseStatus }}
                        </div>
                    </div>
                    <div class="bg-slate-800/60 p-4 rounded-2xl shadow border border-slate-700/60">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seguridad</span>
                        <div class="text-lg font-bold capitalize mt-1" :class="getSecurityColor(diagnosticStore.report.securityStatus)">
                            {{ diagnosticStore.report.securityStatus }}
                        </div>
                    </div>
                </div>

                <!-- Resumen Ejecutivo -->
                <div class="bg-slate-800/60 p-6 rounded-2xl shadow border border-slate-700/60">
                    <h2 class="text-lg font-semibold text-white mb-2">Resumen Ejecutivo</h2>
                    <p class="text-slate-300 leading-relaxed text-sm">{{ diagnosticStore.report.summary }}</p>
                </div>

                <!-- Detalles por Componente y Recomendaciones -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-slate-800/60 p-6 rounded-2xl shadow border border-slate-700/60">
                        <h3 class="text-md font-semibold text-white mb-3">Análisis Detallado</h3>
                        <ul class="space-y-3 text-sm text-slate-300">
                            <li><strong class="text-white">Backend:</strong> {{ diagnosticStore.report.details.backend }}</li>
                            <li><strong class="text-white">Frontend:</strong> {{ diagnosticStore.report.details.frontend }}</li>
                            <li><strong class="text-white">Base de Datos:</strong> {{ diagnosticStore.report.details.database }}</li>
                            <li><strong class="text-white">Seguridad:</strong> {{ diagnosticStore.report.details.security }}</li>
                        </ul>
                    </div>

                    <div class="bg-slate-800/60 p-6 rounded-2xl shadow border border-slate-700/60">
                        <h3 class="text-md font-semibold text-white mb-3">Recomendaciones de Acción</h3>
                        <ul class="list-disc list-inside space-y-2 text-sm text-slate-300">
                            <li v-for="(rec, index) in diagnosticStore.report.recommendations" :key="index">
                                {{ rec }}
                            </li>
                        </ul>
                    </div>
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