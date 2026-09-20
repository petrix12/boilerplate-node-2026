<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

defineProps({
    text: {
        type: String,
        default: 'Continuar con Google'
    }
});

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

let googleTokenClient = null;

onMounted(() => {
    // Asegurarnos de cargar el script de Google Identity Services
    const scriptId = 'google-gsi-script';
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        script.onload = initGoogleClient;
        document.head.appendChild(script);
    } else {
        initGoogleClient();
    }
});

const initGoogleClient = () => {
    if (window.google) {
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
        });
    }
};

// Esta función se ejecuta cuando Google valida al usuario exitosamente en el popup
const handleCredentialResponse = async (response) => {
    loading.value = true;
    try {
        const idToken = response.credential; // Este es el idToken exacto que espera tu backend

        // Llamamos a la acción de tu store que comunica con el backend (/api/auth/google)
        await authStore.loginWithGoogle(idToken);

        // Redirigir al dashboard o ruta protegida
        router.push({ name: 'dashboard' });
    } catch (err) {
        console.error('Error al autenticar con el backend:', err);
    } finally {
        loading.value = false;
    }
};

const handleGoogleLogin = () => {
    loading.value = true;
    if (window.google) {
        // Muestra el prompt de selección de cuenta de Google
        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Si el One Tap está bloqueado o se omite, forzamos el flujo interactivo o renderizado
                loading.value = false;
                console.warn('Google One Tap no se pudo mostrar, usa el flujo alternativo si es necesario.');
            }
        });
    } else {
        loading.value = false;
        console.error('Google SDK no está cargado aún.');
    }
};
</script>

<template>
    <button
        type="button"
        @click="handleGoogleLogin"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-900 hover:bg-slate-950 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
    >
        <!-- Icono genérico o puedes adaptarlo -->
        <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
            <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"/>
        </svg>
        <span>{{ loading ? 'Conectando...' : text }}</span>
    </button>
</template>