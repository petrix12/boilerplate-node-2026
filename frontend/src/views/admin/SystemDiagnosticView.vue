<!-- src/views/admin/SystemDiagnosticView.vue -->
<script setup>
import { computed, onMounted } from 'vue';
import { useAIStore } from '@/stores/ai.store';
import { SparklesIcon } from '@heroicons/vue/24/outline';
import PageLayout from '@/components/common/PageLayout.vue';

const diagnosticStore = useAIStore();

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