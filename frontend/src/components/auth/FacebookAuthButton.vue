<!-- src/components/auth/FacebookAuthButton.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { getSwalTheme } from '@/utils/swal';

const props = defineProps({
    text: {
        type: String,
        default: 'Continuar con Facebook'
    },
    isRegisterContext: {
        type: Boolean,
        default: false
    }
});

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

// Verificamos si la variable de entorno está presente para decidir si mostramos el botón
const appId = import.meta.env.VITE_SOCIAL_META_CLIENT_ID;
const isConfigured = computed(() => {
    return appId && appId !== 'tu-facebook-app-id' && appId.trim() !== '';
});

onMounted(() => {
    if (!isConfigured.value) return;

    window.fbAsyncInit = function() {
        window.FB.init({
            appId: appId,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
        });
    };

    const scriptId = 'facebook-jssdk';
    if (!document.getElementById(scriptId)) {
        const js = document.createElement('script');
        js.id = scriptId;
        js.src = 'https://connect.facebook.net/es_ES/sdk.js';
        js.async = true;
        js.defer = true;
        document.head.appendChild(js);
    }
});

const handleFacebookLogin = () => {
    if (!window.FB) {
        // Usamos getSwalTheme() respetando el estándar del proyecto para alertas limpias
        getSwalTheme().fire({
            icon: 'error',
            title: 'SDK no disponible',
            text: 'El SDK de Facebook aún se está cargando. Inténtalo de nuevo en unos segundos.',
        });
        return;
    }

    loading.value = true;
    
    window.FB.login((response) => {
        if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
            
            authStore.loginWithFacebook(accessToken)
                .then(async (result) => {
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
                })
                .catch((err) => {
                    console.error('Error al autenticar con el backend:', err);
                    getSwalTheme().fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: authStore.error || 'No se pudo iniciar sesión con Facebook',
                    });
                })
                .finally(() => {
                    loading.value = false;
                });
        } else {
            loading.value = false;
            console.log('El usuario canceló el inicio de sesión o no autorizó completamente.');
        }
    }, { scope: 'email,public_profile' });
};
</script>

<template>
    <!-- Renderizado condicional: Si no hay credenciales configuradas, el componente no se pinta en el DOM -->
    <div v-if="isConfigured" class="w-full relative">
        <button 
            type="button" 
            @click="handleFacebookLogin"
            :disabled="loading"
            class="w-full h-[40px] flex items-center justify-center gap-3 px-4 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.27-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>{{ loading ? 'Conectando...' : text }}</span>
        </button>
    </div>
</template>