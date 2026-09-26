<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton.vue';

const authStore = useAuthStore();
const router = useRouter();
const hasLogoError = ref(false);
const showPassword = ref(false);

const handleLogoError = () => {
    hasLogoError.value = true;
};

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
});

const handleSubmit = async () => {
    try {
        await authStore.register(form.value);
        router.push({ name: 'dashboard' });
    } catch (err) {
        console.error('Error en registro:', err);
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4">
        <div class="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
            
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
                    <span class="font-bold text-center text-xl text-emerald-400">{{ $appName }}</span>
                </router-link>
            </div>

            <h2 class="text-xl font-bold text-center text-slate-100 mb-6">Crear Cuenta</h2>

            <div v-if="authStore.error" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {{ authStore.error }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Nombre</label>
                        <input
                            v-model="form.firstName"
                            type="text"
                            required
                            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200"
                            placeholder="Juan"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Apellido</label>
                        <input
                            v-model="form.lastName"
                            type="text"
                            required
                            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200"
                            placeholder="Pérez"
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Correo Electrónico</label>
                    <input
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200"
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Contraseña</label>
                    <div class="relative">
                        <input
                            v-model="form.password"
                            :type="showPassword ? 'text' : 'password'"
                            required
                            class="w-full px-4 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200"
                            placeholder="••••••••"
                        />
                        <!-- Botón del ojito -->
                        <button 
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                        >
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    :disabled="authStore.loading"
                    class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
                </button>
            </form>

            <!-- Divisor visual -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-700"></div></div>
                <div class="relative flex justify-center text-xs uppercase"><span class="bg-slate-800 px-2 text-slate-400">O</span></div>
            </div>

            <!-- Mismo componente reutilizado con otro texto -->
            <GoogleAuthButton text="Registrarse con Google" :isRegisterContext="true" />            

            <p class="mt-6 text-center text-sm text-slate-400">
                ¿Ya tienes cuenta?
                <router-link to="/login" class="text-emerald-400 hover:underline">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>