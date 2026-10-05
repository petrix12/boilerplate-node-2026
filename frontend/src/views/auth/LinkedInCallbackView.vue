<!-- src/views/auth/LinkedInCallbackView.vue -->
<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { getSwalTheme } from '@/utils/swal';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    const code = route.query.code;
    const error = route.query.error;

    if (error) {
        getSwalTheme().fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'El usuario canceló o hubo un error con LinkedIn.',
        });
        router.push('/login');
        return;
    }

    if (code) {
        try {
            const result = await authStore.loginWithLinkedIn(code);
            const resData = result.data || result;
            
            await router.push({ name: 'dashboard' });

            getSwalTheme().fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión con LinkedIn correctamente.',
                toast: true,
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: 'Entendido',
                timer: 5000
            });
        } catch (err) {
            console.error('Error al autenticar con LinkedIn en el backend:', err);
            getSwalTheme().fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: authStore.error || 'No se pudo completar la autenticación con LinkedIn.',
            });
            router.push('/login');
        }
    } else {
        router.push('/login');
    }
});
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-800 dark:text-slate-100">
        <div class="text-center space-y-4">
            <div class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 class="text-xl font-semibold">Autenticando con LinkedIn...</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Por favor, espera un momento mientras validamos tus credenciales.</p>
        </div>
    </div>
</template>