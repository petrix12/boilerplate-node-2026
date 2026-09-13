<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useAuthStore } from '../stores/auth.store';
    import {
        Cog6ToothIcon, 
        Squares2X2Icon, 
        ArrowRightOnRectangleIcon, 
        ChevronDownIcon 
    } from '@heroicons/vue/24/outline';

    const props = defineProps({
        title: {
            type: String,
            default: 'Dashboard'
        }
    });

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const isDropdownOpen = ref(false);
    const dropdownRef = ref(null);

    // Inicial del nombre para avatar por defecto
    const userInitial = computed(() => {
        return authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'U';
    });

    // Comprobar si estamos en una ruta administrativa
    const isAdminArea = computed(() => {
        return route.path.startsWith('/admin');
    });

    const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value;
    };

    // Cerrar dropdown al hacer clic afuera
    const handleClickOutside = (event) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
            isDropdownOpen.value = false;
        }
    };

    // Control de error al cargar el logo
    const hasLogoError = ref(false);

    const handleLogoError = () => {
        hasLogoError.value = true;
    };

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    const handleLogout = async () => {
        await authStore.logout();
        router.push({ name: 'login' });
    };
</script>

<template>
    <header class="bg-slate-800 border-b border-slate-700 py-3 px-4 sm:px-6 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
        
            <!-- LADO IZQUIERDO: Logo + Nombre App + Sección Dinámica -->
            <div class="flex items-center space-x-3">
                <router-link to="/" class="flex items-center space-x-2">
                    <!-- Ubicación recomendada de la imagen/logo -->
                    <!-- <img src="/logo.png" alt="App Logo" class="w-8 h-8 object-contain" /> -->
                     <img 
                        v-if="!hasLogoError"
                        src="/logo.png" 
                        alt="App Logo" 
                        @error="handleLogoError"
                        class="w-8 h-8 object-contain" 
                    />
                    <span class="font-bold text-slate-100 hidden sm:inline text-lg">Starter App</span>
                </router-link>

                <span class="text-slate-600 font-light text-xl">/</span>

                <!-- Título dinámico recibido por Props -->
                <h1 class="text-base sm:text-lg font-semibold text-emerald-400">
                    {{ props.title }}
                </h1>
            </div>

            <!-- LADO DERECHO: Perfil / Menú Desplegable -->
            <div class="relative" ref="dropdownRef">
                <button 
                    @click="toggleDropdown"
                    class="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-700/60 transition-colors focus:outline-none"
                >
                    <!-- Foto de perfil o Inicial -->
                    <div v-if="authStore.user?.avatarUrl" class="w-9 h-9 rounded-full overflow-hidden border border-slate-600">
                        <img :src="authStore.user.avatarUrl" :alt="authStore.user.name" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/40 text-sm">
                        {{ userInitial }}
                    </div>

                    <span class="text-sm font-medium text-slate-200 hidden md:inline-block">
                        {{ authStore.user?.name }}
                    </span>

                    <ChevronDownIcon class="w-4 h-4 text-slate-400" />
                </button>

                <!-- Menu Desplegable -->
                <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                >
                    <div 
                        v-if="isDropdownOpen"
                        class="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200"
                    >
                        <!-- Header pequeño del usuario -->
                        <div class="px-4 py-2 border-b border-slate-700/60">
                            <p class="text-xs text-slate-400">Conectado como</p>
                            <p class="text-sm font-semibold truncate text-slate-100">{{ authStore.user?.email }}</p>
                        </div>

                        <!-- Item 1: Configuración / Perfil -->
                        <router-link 
                            to="/profile" 
                            @click="isDropdownOpen = false"
                            class="flex items-center space-x-2.5 px-4 py-2.5 text-sm hover:bg-slate-700/50 transition-colors"
                        >
                            <Cog6ToothIcon class="w-4 h-4 text-slate-400" />
                            <span>Configuración</span>
                        </router-link>

                        <!-- Item 2: Alternar entre Admin y Dashboard de forma profesional -->
                        <router-link 
                            v-if="authStore.userRoles.includes('SUPER_ADMIN') && !isAdminArea" 
                            to="/admin" 
                            @click="isDropdownOpen = false"
                            class="flex items-center space-x-2.5 px-4 py-2.5 text-sm hover:bg-slate-700/50 text-purple-400 transition-colors"
                        >
                            <Squares2X2Icon class="w-4 h-4" />
                            <span>Panel Admin</span>
                        </router-link>

                        <router-link 
                            v-if="isAdminArea" 
                            to="/dashboard" 
                            @click="isDropdownOpen = false"
                            class="flex items-center space-x-2.5 px-4 py-2.5 text-sm hover:bg-slate-700/50 text-emerald-400 transition-colors"
                        >
                            <Squares2X2Icon class="w-4 h-4" />
                            <span>Dashboard</span>
                        </router-link>

                        <div class="border-t border-slate-700/60 my-1"></div>

                        <!-- Item 3: Cerrar sesión -->
                        <button 
                            @click="handleLogout"
                            class="w-full text-left flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon class="w-4 h-4" />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>