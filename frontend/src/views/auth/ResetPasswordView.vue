<!-- src/views/auth/ResetPasswordView.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '@/services/auth.service';

const route = useRoute();
const router = useRouter();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const message = ref('');
const error = ref('');

onMounted(() => {
    token.value = route.query.token || '';
    if (!token.value) {
        error.value = 'Token de recuperación inválido o ausente.';
    }
});

const handleSubmit = async () => {
    if (newPassword.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden.';
        return;
    }

    loading.value = true;
    message.value = '';
    error.value = '';

    try {
        const response = await authService.resetPassword({
            token: token.value,
            newPassword: newPassword.value
        });
        message.value = response.message || 'Contraseña actualizada correctamente.';
        setTimeout(() => {
            router.push('/login');
        }, 3000);
    } catch (err) {
        error.value = err.response?.data?.message || 'El enlace ha expirado o es inválido.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 text-slate-900 dark:text-slate-100">
        <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Restablecer contraseña</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Ingresa tu nueva contraseña para continuar.
                </p>
            </div>

            <!-- Alerta de éxito -->
            <div v-if="message" class="mb-4 p-4 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/50 rounded-lg">
                {{ message }} Redirigiendo al login...
            </div>

            <!-- Alerta de error -->
            <div v-if="error" class="mb-4 p-4 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/50 rounded-lg">
                {{ error }}
            </div>

            <form v-if="token" @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva contraseña</label>
                    <input 
                        type="password" 
                        v-model="newPassword" 
                        required 
                        minlength="6"
                        placeholder="Mínimo 6 caracteres"
                        class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-200"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar nueva contraseña</label>
                    <input 
                        type="password" 
                        v-model="confirmPassword" 
                        required 
                        minlength="6"
                        placeholder="Repite tu contraseña"
                        class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-200"
                    />
                </div>

                <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer shadow-md"
                >
                    {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
                </button>
            </form>

            <div class="text-center mt-6">
                <router-link to="/login" class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                    Ir al inicio de sesión
                </router-link>
            </div>
        </div>
    </div>
</template>