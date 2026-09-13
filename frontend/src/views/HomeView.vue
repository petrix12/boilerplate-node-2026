<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '../stores/auth.store';

    const authStore = useAuthStore();
    const hasLogoError = ref(false);

    const handleLogoError = () => {
        hasLogoError.value = true;
    };
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
        <!-- Navbar simple -->
        <header class="py-4 px-4 sm:px-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 border-b border-slate-800 text-center sm:text-left">
            <!-- Logotipo / Branding -->
            <router-link to="/" class="flex items-center justify-center gap-2.5 shrink-0 group">
                <img 
                    v-if="!hasLogoError" 
                    src="/logo.png" 
                    alt="App Logo" 
                    @error="handleLogoError"
                    class="w-8 h-8 object-contain transition-transform group-hover:scale-105" 
                />
                <span v-else class="text-2xl">⚡</span>
                <span class="font-bold text-lg sm:text-xl text-emerald-400 whitespace-nowrap">{{ $appName }}</span>
            </router-link>

            <!-- Acciones de Usuario -->
            <div class="flex items-center justify-center shrink-0">
                <router-link
                    v-if="authStore.isAuthenticated"
                    to="/dashboard"
                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                >
                    Ir al Dashboard
                </router-link>
                
                <div v-else class="flex items-center justify-center gap-3 sm:gap-4">
                    <router-link 
                        to="/login" 
                        class="px-3 sm:px-4 py-2 text-slate-300 hover:text-white text-sm font-medium whitespace-nowrap transition-colors"
                    >
                        Iniciar Sesión
                    </router-link>
                    <router-link 
                        to="/register" 
                        class="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                        Registrarse
                    </router-link>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <main class="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-12">
            <!-- Logo Prominente en la landing -->
            <div class="mb-6 flex justify-center">
                <img 
                    v-if="!hasLogoError" 
                    src="/logo.png" 
                    alt="App Logo" 
                    @error="handleLogoError"
                    class="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_10px_15px_rgba(16,185,129,0.2)]" 
                />
                <span v-else class="text-6xl">🚀</span>
            </div>

            <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full mb-6">
                Fullstack Starter Kit 2026
            </span>
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
                Acelera el desarrollo de tu aplicación web <span class="text-emerald-400">Enterprise</span>.
            </h1>
            <p class="text-slate-400 text-lg mb-8 max-w-xl">
                Base arquitectónica moderna lista para producción con Node.js, Express, Prisma ORM, PostgreSQL y Vue 3 con Tailwind CSS.
            </p>
            <div class="flex gap-4">
                <router-link
                    :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
                    class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl shadow-lg transition-colors"
                >
                    {{ authStore.isAuthenticated ? 'Ir a mi Panel' : 'Comenzar Ahora' }}
                </router-link>
            </div>          
        </main>

        <!-- Footer -->
        <footer class="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
            &copy; 2026 {{ $appName }}. Todos los derechos reservados.
        </footer>
    </div>
</template>