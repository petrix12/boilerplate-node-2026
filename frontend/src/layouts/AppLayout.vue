<script setup>
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import Navbar from '../components/Navbar.vue';

    const route = useRoute();

    // Extrae el título definido en los meta de la ruta actual
    const pageTitle = computed(() => route.meta.title || 'Dashboard');
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
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