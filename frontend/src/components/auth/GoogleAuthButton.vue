<!-- src/components/auth/GoogleAuthButton.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { getSwalTheme } from '@/utils/swal';

const props = defineProps({
    text: {
        type: String,
        default: 'Continuar con Google'
    },
    isRegisterContext: {
        type: Boolean,
        default: false
    }
});

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const hiddenGoogleContainer = ref(null);
let googleBtnElement = null;

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
            client_id: import.meta.env.VITE_SOCIAL_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            use_fedcm_for_prompt: true
        });

        if (hiddenGoogleContainer.value) {
            // Limpiamos por si acaso
            hiddenGoogleContainer.value.innerHTML = '';
            
            // Renderizamos el botón de Google en modo tipo icono o estándar pero oculto/invisible
            window.google.accounts.id.renderButton(hiddenGoogleContainer.value, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
            });

            // Esperamos un momento a que el iframe inyecte el div role="button" interno de Google
            setTimeout(() => {
                if (hiddenGoogleContainer.value) {
                    googleBtnElement = hiddenGoogleContainer.value.querySelector('div[role="button"]');
                }
            }, 500);
        }
    }
};

// Función que ejecuta el botón personalizado y dispara el clic del iframe real de Google
const triggerGoogleLogin = () => {
    if (!googleBtnElement) {
        // Intentamos buscarlo nuevamente por si tardó un poco más en cargar
        if (hiddenGoogleContainer.value) {
            googleBtnElement = hiddenGoogleContainer.value.querySelector('div[role="button"]');
        }
    }

    if (googleBtnElement) {
        googleBtnElement.click();
    } else {
        getSwalTheme().fire({
            icon: 'info',
            title: 'Cargando Google',
            text: 'El servicio de Google se está inicializando. Inténtalo de nuevo en un segundo.',
            background: '#1e293b',
            color: '#f8fafc',
        });
    }
};

const handleCredentialResponse = async (response) => {
    loading.value = true;
    try {
        const idToken = response.credential;
        const result = await authStore.loginWithGoogle(idToken);
        const resData = result.data || result;

        await router.push({ name: 'dashboard' });

        if (props.isRegisterContext && resData.isNewUser === false) {
            getSwalTheme().fire({
                icon: 'info',
                title: '¡Hola de nuevo!',
                text: 'Detectamos que ya tenías una cuenta registrada, por lo que hemos iniciado sesión directamente.',
                toast: true,
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: 'Entendido',
                timer: 7500
            });
        }
    } catch (err) {
        console.error('Error al autenticar con el backend:', err);
        getSwalTheme().fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: authStore.error || 'No se pudo iniciar sesión con Google',
            background: '#1e293b',
            color: '#f8fafc',
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="w-full relative">
        <!-- 1. Botón personalizado con Tailwind exactamente idéntico al de Facebook -->
        <button 
            type="button" 
            @click="triggerGoogleLogin"
            :disabled="loading"
            class="w-full h-[40px] flex items-center justify-center gap-3 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium transition-colors shadow-sm disabled:opacity-50">
            <!-- Logo oficial de Google SVG -->
            <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.2 21.32 7.32 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.4s.13-1.68.38-2.4V6.29H1.19C.43 7.82 0 9.55 0 11.84s.43 4.02 1.19 5.55l4.08-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.2 2.68 1.19 6.29l4.08 3.15c.95-2.85 3.6-4.69 6.73-4.69z"/>
            </svg>
            <span>{{ loading ? 'Conectando...' : text }}</span>
        </button>

        <!-- 2. Contenedor fantasma de Google (Oculto visualmente pero activo en DOM para cumplir con el SDK) -->
        <div ref="hiddenGoogleContainer" class="absolute inset-0 opacity-0 pointer-events-none overflow-hidden"></div>
    </div>
</template>