<!-- src/components/common/FooterComponent.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'NodeVue Boilerplate';
const currentYear = new Date().getFullYear();

const copyrightText = computed(() => {
    if (props.isAdmin) {
        return `© ${currentYear} Panel de Administración. Todos los derechos reservados.`;
    }
    return `© ${currentYear} ${appName}. Todos los derechos reservados.`;
});
</script>

<template>
    <footer class="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 px-6 mt-auto text-xs text-slate-500 dark:text-slate-400">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <!-- Texto de Copyright dinámico -->
            <div>
                {{ copyrightText }}
            </div>

            <!-- Enlaces Legales y de Soporte -->
            <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <router-link to="/about" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Quiénes Somos</router-link>
                <router-link to="/contact" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contacto</router-link>
                <router-link to="/privacy" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacidad</router-link>
                <router-link to="/terms" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Términos</router-link>
                <router-link to="/cookies" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cookies</router-link>
                <router-link to="/data-deletion" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Eliminación de Datos</router-link>
            </div>
        </div>
    </footer>
</template>