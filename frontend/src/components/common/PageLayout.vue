<!-- src/components/common/PageLayout.vue -->
<script setup>
import { computed } from 'vue';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import FooterComponent from '@/components/common/FooterComponent.vue';

const appName = import.meta.env.VITE_APP_NAME || 'Mi Aplicación';
const currentYear = new Date().getFullYear();

// 1. Asignamos los props a una constante para poder acceder a ellos
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    backTo: {
        type: [String, Object],
        default: null
    },
    backText: {
        type: String,
        default: 'Volver'
    },
    showFooter: {
        type: Boolean,
        default: true
    },
    isAdmin: { 
        type: Boolean, 
        default: true 
    }
});

// 2. Ahora 'props.isAdmin' ya está definido correctamente y es reactivo
const footerText = computed(() => {
    if (props.isAdmin) {
        return `© ${currentYear} Panel de Administración. Todos los derechos reservados.`;
    }
    return `© ${currentYear} ${appName}. Todos los derechos reservados.`;
});
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <div class="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
            
            <!-- Header / Tarjeta de Encabezado -->
            <div class="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
                <div v-if="backTo">
                    <router-link 
                        :to="backTo" 
                        class="inline-flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors group"
                    >
                        <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span>{{ backText }}</span>
                    </router-link>
                </div>

                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ title }}</h1>
                        <p v-if="description" class="text-sm text-slate-600 dark:text-slate-400">{{ description }}</p>
                    </div>
                    
                    <div v-if="$slots.actions" class="flex items-center gap-2">
                        <slot name="actions" />
                    </div>
                </div>
            </div>

            <!-- Slot para Filtros -->
            <slot name="filters" />

            <!-- Slot para el Contenido Principal -->
            <slot />

            <!-- Slot para Modales -->
            <slot name="modales" />

        </div>

        <!-- Pie de página -->
        <FooterComponent v-if="showFooter" :isAdmin="isAdmin" />
    </div>
</template>