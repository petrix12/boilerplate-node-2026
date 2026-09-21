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
const googleButtonRef = ref(null);

onMounted(() => {
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
            use_fedcm_for_prompt: true
        });

        if (googleButtonRef.value) {
            // Renderizamos el botón oficial de Google adaptado al contenedor
            window.google.accounts.id.renderButton(googleButtonRef.value, {
                type: 'standard',
                theme: 'filled_black', // 'outline' o 'filled_black' para combinar con dark mode
                size: 'large',
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            });
        }
    }
};

const handleCredentialResponse = async (response) => {
    loading.value = true;
    try {
        const idToken = response.credential; // El token exacto que espera tu backend
        await authStore.loginWithGoogle(idToken);
        router.push({ name: 'dashboard' });
    } catch (err) {
        console.error('Error al autenticar con el backend:', err);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="w-full relative">
        <!-- Contenedor donde Google inyectará su botón interactivo y seguro -->
        <div ref="googleButtonRef" class="w-full flex justify-center overflow-hidden rounded-lg"></div>
    </div>
</template>