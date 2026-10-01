<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import Navbar from '@/components/Navbar.vue';
import AIChatWidget from '@/components/common/AIChatWidget.vue';

const route = useRoute();
const authStore = useAuthStore();

// Extrae el título definido en los meta de la ruta actual
const pageTitle = computed(() => route.meta.title || 'Dashboard');

// Verificamos si la funcionalidad de IA está activa en el sistema/usuario
const isAiActive = computed(() => authStore.aiDiagnosticActive);
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
        <!-- El Navbar permanece estático y vivo siempre -->
        <Navbar :title="pageTitle" />

        <!-- Solo esta zona cambia dinámicamente según la ruta sin pestañeo -->
        <main class="flex-1 w-full">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>

        <!-- Widget Flotante de IA integrado globalmente -->
        <AIChatWidget v-if="isAiActive" />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>