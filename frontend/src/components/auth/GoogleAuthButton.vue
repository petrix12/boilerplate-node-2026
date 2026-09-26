<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import Swal from 'sweetalert2';

// Única llamada a defineProps combinando ambas propiedades
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
            window.google.accounts.id.renderButton(googleButtonRef.value, {
                type: 'standard',
                theme: 'filled_black',
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
        const idToken = response.credential;
        const result = await authStore.loginWithGoogle(idToken);
        
        const resData = result.data || result;

        // Redirigimos al dashboard primero
        await router.push({ name: 'dashboard' });

        // Si estamos en el flujo de registro y el backend indicó que la cuenta ya existía
        if (props.isRegisterContext && resData.isNewUser === false) {
            Swal.fire({
                icon: 'info',
                title: '¡Hola de nuevo!',
                text: 'Detectamos que ya tenías una cuenta registrada, por lo que hemos iniciado sesión directamente.',
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 7500,
                timerProgressBar: true,
                background: '#1e293b',
                color: '#f8fafc',
            });
        }
    } catch (err) {
        console.error('Error al autenticar con el backend:', err);
        Swal.fire({
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
        <!-- Contenedor donde Google inyectará su botón interactivo y seguro -->
        <div ref="googleButtonRef" class="w-full flex justify-center overflow-hidden rounded-lg"></div>
    </div>
</template>