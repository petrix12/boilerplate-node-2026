<!-- src/views/auth/LoginView.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton.vue';
import FacebookAuthButton from '@/components/auth/FacebookAuthButton.vue';
import LinkedInAuthButton from '@/components/auth/LinkedInAuthButton.vue';
import InstagramAuthButton from '@/components/auth/InstagramAuthButton.vue';

const authStore = useAuthStore();
const router = useRouter();
const hasLogoError = ref(false);
const showPassword = ref(false);

const handleLogoError = () => {
    hasLogoError.value = true;
};

const form = ref({
    email: '',
    password: '',
});

const handleSubmit = async () => {
    try {
        await authStore.login(form.value);
        router.push({ name: 'dashboard' });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
        <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
            
            <!-- Logo Centrado -->
            <div class="flex flex-col items-center justify-center mb-6">
                <router-link to="/" class="flex flex-col items-center group">
                    <img 
                        v-if="!hasLogoError" 
                        src="/logo.png" 
                        alt="App Logo" 
                        @error="handleLogoError"
                        class="w-14 h-14 object-contain mb-3 transition-transform group-hover:scale-105" 
                    />
                    <span v-else class="text-4xl mb-2">🌳</span>
                    <span class="font-bold text-center text-xl text-emerald-600 dark:text-emerald-400">{{ $appName }}</span>
                </router-link>
            </div>

            <h2 class="text-xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">Iniciar Sesión</h2>

            <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {{ authStore.error }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                    <input
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Contraseña</label>
                    <div class="relative">
                        <input
                            v-model="form.password"
                            :type="showPassword ? 'text' : 'password'"
                            required
                            class="w-full px-4 py-2 pr-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                            placeholder="••••••••"
                        />
                        <!-- Botón del ojito -->
                        <button 
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        >
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    :disabled="authStore.loading"
                    class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {{ authStore.loading ? 'Cargando...' : 'Entrar' }}
                </button>
                
                <!-- Enlace de contraseña olvidada alineado a la derecha -->
                <div class="flex justify-end mt-1.5">
                    <router-link to="/forgot-password" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                        ¿Olvidaste tu contraseña?
                    </router-link>
                </div>
            </form>

            <!-- Divisor visual -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                <div class="relative flex justify-center text-xs uppercase"><span class="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">O</span></div>
            </div>

            <!-- Botones de Autenticación Social -->
            <div class="space-y-3">
                <GoogleAuthButton text="Iniciar sesión con Google" />            
                <FacebookAuthButton text="Iniciar sesión con Facebook" />
                <LinkedInAuthButton text="Iniciar sesión con LinkedIn" />
                <InstagramAuthButton text="Iniciar sesión con Instagram" />
            </div>

            <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                ¿No tienes cuenta?
                <router-link to="/register" class="text-emerald-600 dark:text-emerald-400 hover:underline">Regístrate aquí</router-link>
            </p>
        </div>
    </div>
</template>