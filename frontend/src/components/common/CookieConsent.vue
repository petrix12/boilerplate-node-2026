<!-- src/components/common/CookieConsent.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const showBanner = ref(false);

onMounted(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
        // Mostramos el banner si el usuario no ha tomado una decisión previa
        showBanner.value = true;
    }
});

const acceptAll = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    showBanner.value = false;
};

const rejectOptional = () => {
    localStorage.setItem('cookie_consent', 'essential_only');
    showBanner.value = false;
};
</script>

<template>
    <transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
    >
        <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-100 shadow-2xl">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-sm text-slate-300 text-center sm:text-left">
                    Utilizamos cookies propias y técnicas (almacenamiento local) para garantizar el funcionamiento seguro de la sesión y mejorar tu experiencia. Puedes consultar más detalles en nuestra 
                    <router-link to="/cookies" class="text-emerald-400 hover:underline font-medium">Política de Cookies</router-link>.
                </div>
                <div class="flex items-center gap-3 shrink-0">
                    <button 
                        @click="rejectOptional"
                        class="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
                    >
                        Solo técnicas
                    </button>
                    <button 
                        @click="acceptAll"
                        class="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors cursor-pointer"
                    >
                        Aceptar todas
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>