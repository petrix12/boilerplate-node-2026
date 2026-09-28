<!-- src/views/auth/VerifyEmailView.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '@/services/auth.service';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const success = ref(false);
const message = ref('');

onMounted(async () => {
    const token = route.query.token;

    if (!token) {
        loading.value = false;
        success.value = false;
        message.value = 'Token de verificación no proporcionado.';
        return;
    }

    try {
        const response = await authService.verifyEmail(token);
        success.value = true;
        message.value = response.message || 'Correo verificado correctamente.';
    } catch (error) {
        success.value = false;
        message.value = error.response?.data?.message || 'Hubo un error al verificar el correo o el token ha expirado.';
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-slate-900 dark:text-white">
                Verificación de Correo Electrónico
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white dark:bg-slate-800 px-6 py-12 shadow sm:rounded-lg sm:px-12 text-center">
                
                <!-- Estado Cargando -->
                <div v-if="loading" class="space-y-4">
                    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent align-[-0.125em]" role="status"></div>
                    <p class="text-sm text-slate-600 dark:text-slate-300">Verificando tu cuenta, por favor espera...</p>
                </div>

                <!-- Estado Resultado -->
                <div v-else class="space-y-6">
                    <div :class="success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'" class="text-lg font-medium">
                        {{ message }}
                    </div>

                    <div>
                        <router-link
                            to="/login"
                            class="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                        >
                            Ir a Iniciar Sesión
                        </router-link>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>