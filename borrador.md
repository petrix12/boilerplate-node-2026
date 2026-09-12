## 🎨 Inicialización de la Capa de Presentación (Frontend SPA)

### 🌐 Paso 4: Cliente HTTP Centralizado (`src/api/axios.js`)
2. Crea la `carpeta src/api/` y el archivo `src/api/axios.js`:
    ```js
    import axios from 'axios';

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Interceptor para inyectar automáticamente el Token Bearer si existe en localStorage
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    export default api;
    ```

### 🍍 Paso 5: Store de Autenticación con Pinia (`src/stores/auth.store.js`)
+ Crea o reemplaza el archivo en `src/stores/auth.store.js`:
    ```js
    import { defineStore } from 'pinia';
    import api from '../api/axios';

    export const useAuthStore = defineStore('auth', {
        state: () => ({
            user: null,
            token: localStorage.getItem('token') || null,
            loading: false,
            error: null,
        }),

        getters: {
            isAuthenticated: (state) => !!state.token && !!state.user,
            userRoles: (state) => state.user?.roles || [],
        },

        actions: {
            // 1. Iniciar Sesión
            async login(credentials) {
                this.loading = true;
                this.error = null;
                try {
                    const response = await api.post('/auth/login', credentials);
                    // Verificación defensiva de la estructura
                    const data = response.data?.data || response.data;
                    
                    this.token = data.token;
                    this.user = data.user;
                    localStorage.setItem('token', data.token);

                    return response.data;
                } catch (err) {
                    this.error = err.response?.data?.message || 'Error al iniciar sesión';
                    throw err;
                } finally {
                    this.loading = false;
                }
            },

            // 2. Registrar Usuario
            async register(userData) {
                this.loading = true;
                this.error = null;
                try {
                    const response = await api.post('/auth/register', userData);
                    const { user, token } = response.data.data;

                    this.token = token;
                    this.user = user;
                    localStorage.setItem('token', token);

                    return response.data;
                } catch (err) {
                    this.error = err.response?.data?.message || 'Error al registrar usuario';
                    throw err;
                } finally {
                    this.loading = false;
                }
            },

            // 3. Verificar Sesión al recargar la página
            async fetchUser() {
                if (!this.token) return;

                this.loading = true;
                try {
                    const response = await api.get('/auth/me');
                    this.user = response.data.data.user;
                } catch (err) {
                    console.error('Sesión expirada o token inválido:', err);
                    this.logout();
                } finally {
                    this.loading = false;
                }
            },

            // 4. Cerrar Sesión
            async logout() {
                try {
                    if (this.token) {
                    await api.post('/auth/logout');
                    }
                } catch (err) {
                    console.warn('Error respondiendo al servidor en logout:', err);
                } finally {
                    this.user = null;
                    this.token = null;
                    localStorage.removeItem('token');
                }
            },
        },
    });
    ```

### 🚦 Paso 6: Configuración de Vue Router con Guards (`src/router/index.js`)
+ Abre o crea el archivo `src/router/index.js` y reemplaza su contenido:
    ```js
    import { createRouter, createWebHistory } from 'vue-router';
    import { useAuthStore } from '../stores/auth.store';

    // Vistas públicas y estáticas
    import HomeView from '../views/HomeView.vue';
    import LoginView from '../views/LoginView.vue';
    import RegisterView from '../views/RegisterView.vue';
    import DashboardView from '../views/DashboardView.vue';
    import NotFoundView from '../views/NotFoundView.vue';

    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: '/',
                name: 'home',
                component: HomeView,
            },
            {
                path: '/login',
                name: 'login',
                component: LoginView,
                meta: { requiresGuest: true },
            },
            {
                path: '/register',
                name: 'register',
                component: RegisterView,
                meta: { requiresGuest: true },
            },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: DashboardView,
                meta: { requiresAuth: true },
            },
        ],
    });

    // Navigation Guard Global
    router.beforeEach(async (to) => {
        const authStore = useAuthStore();

        // Rehidratar sesión si hay token pero no datos de usuario en memoria
        if (authStore.token && !authStore.user) {
            await authStore.fetchUser();
        }

        const isAuthenticated = authStore.isAuthenticated;

        // 1. Ruta requiere autenticación y el usuario NO está logueado
        if (to.meta.requiresAuth && !isAuthenticated) {
            return { name: 'login' };
        }

        // 2. Ruta requiere ser invitado (Guest) y el usuario SÍ está logueado
        if (to.meta.requiresGuest && isAuthenticated) {
            return { name: 'dashboard' };
        }

        return true;
    });

    export default router;
    ```

### 🎨 Paso 7: Vistas de Autenticación y Dashboard (`src/views/`)
1. Suministrar icono y logo de la aplicación en:
    + Icono: `public/favicon.ico`.
    + Logo: `public/logo.png`.
2. Formulario de Inicio de Sesión (`src/views/LoginView.vue`)
    + Crea el archivo `src/views/LoginView.vue`:
        ```vue
        <script setup>
            import { ref } from 'vue';
            import { useRouter } from 'vue-router';
            import { useAuthStore } from '../stores/auth.store';

            const authStore = useAuthStore();
            const router = useRouter();

            const hasLogoError = ref(false);

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
                            <span class="font-bold text-xl text-emerald-400">FamilyTree 2026</span>
                        </router-link>
                    </div>

                    <h2 class="text-xl font-bold text-center text-slate-100 mb-6">Iniciar Sesión</h2>

                    <div v-if="authStore.error" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                        {{ authStore.error }}
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
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
                            <input
                                v-model="form.password"
                                type="password"
                                required
                                class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="authStore.loading"
                            class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {{ authStore.loading ? 'Cargando...' : 'Entrar' }}
                        </button>
                    </form>

                    <p class="mt-6 text-center text-sm text-slate-400">
                        ¿No tienes cuenta?
                        <router-link to="/register" class="text-emerald-400 hover:underline">Regístrate aquí</router-link>
                    </p>
                </div>
            </div>
        </template>      
        ```
3. Crear el Layout Principal (`src/layouts/AppLayout.vue`)
    + Crea un layout que envuelva todas las páginas autenticadas:
        ```vue
        <script setup>
            import { computed } from 'vue';
            import { useRoute } from 'vue-router';
            import Navbar from '../components/Navbar.vue';

            const route = useRoute();

            // Extrae el título definido en los meta de la ruta actual
            const pageTitle = computed(() => route.meta.title || 'Dashboard');
        </script>

        <template>
            <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
                <!-- El Navbar permanece estático y vivo siempre -->
                <Navbar :title="pageTitle" />

                <!-- Solo esta zona cambia dinámicamente según la ruta sin pestañeo -->
                <main class="flex-1 w-full">
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </main>
            </div>
        </template>

        <style scoped>
            .fade-enter-active,
            .fade-leave-active {
                transition: opacity 0.15s ease;
            }
            .fade-enter-from,
            .fade-leave-to {
                opacity: 0;
            }
        </style>
        ```
4. Componente Navbar Reutilizable (`src/components/Navbar.vue`)
    + Crea el archivo `src/components/Navbar.vue`:
        ```vue
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
        ```
5. Vista de Configuración / Perfil (`src/views/ProfileView.vue`)
    + Crearemos la nueva pantalla de perfil limpia y estructurada:
        ```vue
        <script setup>
        import { ref, watch } from 'vue';
        import { useAuthStore } from '../stores/auth.store';
        import { UserIcon, KeyIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline';
        import axios from 'axios';
        import Swal from 'sweetalert2';

        const authStore = useAuthStore();
        const fileInputRef = ref(null);
        const saving = ref(false);

        // Configuración base de SweetAlert2 con estilo oscuro (Slate)
        const swalDark = Swal.mixin({
            background: '#1e293b',
            color: '#f8fafc',
            customClass: {
                popup: 'rounded-2xl border border-slate-700 shadow-2xl',
                confirmButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors',
                cancelButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
            },
            buttonsStyling: false
        });

        // Formulario reactivo
        const profileForm = ref({
            name: authStore.user?.name || '',
            email: authStore.user?.email || '',
            currentPassword: '',
            newPassword: '',
            avatarUrl: authStore.user?.avatarUrl || null,
            avatarFile: null
        });

        // Sincronizar cambios en authStore.user
        watch(() => authStore.user, (newUser) => {
            if (newUser) {
                profileForm.value.name = newUser.name || '';
                profileForm.value.email = newUser.email || '';
                if (!profileForm.value.avatarFile) {
                    profileForm.value.avatarUrl = newUser.avatarUrl || null;
                }
            }
        }, { immediate: true });

        // Previsualizar la imagen seleccionada localmente
        const handleAvatarChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Validar tamaño máximo (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    swalDark.fire({
                        title: 'Archivo muy grande',
                        text: 'La imagen supera el tamaño máximo permitido de 2MB.',
                        icon: 'warning'
                    });
                    if (fileInputRef.value) fileInputRef.value.value = '';
                    return;
                }

                // Liberar ObjectURL anterior si existía para evitar leaks de memoria
                if (profileForm.value.avatarUrl && profileForm.value.avatarUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(profileForm.value.avatarUrl);
                }

                profileForm.value.avatarFile = file;
                profileForm.value.avatarUrl = URL.createObjectURL(file);
            }
        };

        // Cancelar/Quitar selección local de la foto
        const removeAvatarSelection = () => {
            if (profileForm.value.avatarUrl && profileForm.value.avatarUrl.startsWith('blob:')) {
                URL.revokeObjectURL(profileForm.value.avatarUrl);
            }
            profileForm.value.avatarFile = null;
            profileForm.value.avatarUrl = authStore.user?.avatarUrl || null;
            if (fileInputRef.value) fileInputRef.value.value = '';
        };

        // Guardar Cambios del Perfil
        const updateProfile = async () => {
            const nameChanged = profileForm.value.name !== authStore.user?.name;
            const passwordProvided = Boolean(profileForm.value.newPassword);
            const avatarProvided = Boolean(profileForm.value.avatarFile);

            if (!avatarProvided && !nameChanged && !passwordProvided) {
                swalDark.fire({
                    title: 'Sin cambios',
                    text: 'No has realizado ninguna modificación en tu perfil.',
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false
                });
                return;
            }

            // Validación de contraseña si intenta cambiarla
            if (passwordProvided && !profileForm.value.currentPassword) {
                swalDark.fire({
                    title: 'Campo requerido',
                    text: 'Debes ingresar tu contraseña actual para establecer una nueva.',
                    icon: 'warning'
                });
                return;
            }

            saving.value = true;
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
            const authHeaders = {
                headers: { Authorization: `Bearer ${authStore.token}` }
            };

            try {
                let updatedUserData = null;

                // 1. Subir Avatar
                if (profileForm.value.avatarFile) {
                    const formData = new FormData();
                    formData.append('avatar', profileForm.value.avatarFile);

                    const avatarRes = await axios.post(`${baseUrl}/auth/avatar`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${authStore.token}`
                        }
                    });
                    updatedUserData = avatarRes.data.data?.user || avatarRes.data.user;
                }

                // 2. Actualizar Datos de Perfil (Nombre y/o Contraseña)
                if (nameChanged || passwordProvided) {
                    const profilePayload = {
                        name: profileForm.value.name,
                        ...(passwordProvided && {
                            currentPassword: profileForm.value.currentPassword,
                            newPassword: profileForm.value.newPassword
                        })
                    };

                    const profileRes = await axios.put(`${baseUrl}/auth/profile`, profilePayload, authHeaders);
                    updatedUserData = profileRes.data.data?.user || profileRes.data.user;
                }

                // 3. Actualizar Store de Pinia
                if (updatedUserData) {
                    if (typeof authStore.setUser === 'function') {
                        authStore.setUser(updatedUserData);
                    } else {
                        authStore.user = { ...authStore.user, ...updatedUserData };
                    }
                }

                // Limpieza de campos de contraseña y archivos
                profileForm.value.currentPassword = '';
                profileForm.value.newPassword = '';
                profileForm.value.avatarFile = null;
                if (fileInputRef.value) fileInputRef.value.value = '';

                swalDark.fire({
                    title: '¡Perfil actualizado!',
                    text: 'Tus datos se han guardado correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

            } catch (error) {
                console.error('Error al actualizar perfil:', error);
                swalDark.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Ocurrió un error al intentar actualizar el perfil.',
                    icon: 'error'
                });
            } finally {
                saving.value = false;
            }
        };

        // Eliminar avatar definitivamente
        const removeCurrentAvatar = async () => {
            const confirmResult = await swalDark.fire({
                title: '¿Eliminar foto de perfil?',
                text: 'Tu avatar se borrará permanentemente de tu cuenta.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    popup: 'rounded-2xl border border-slate-700 shadow-2xl',
                    confirmButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-red-600 hover:bg-red-500 text-white transition-colors mr-3',
                    cancelButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                }
            });

            if (!confirmResult.isConfirmed) return;

            saving.value = true;
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

            try {
                const response = await axios.delete(`${baseUrl}/auth/avatar`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });

                const updatedUser = response.data.data?.user || response.data.user;

                if (typeof authStore.setUser === 'function') {
                    authStore.setUser(updatedUser);
                } else {
                    authStore.user = { ...authStore.user, avatarUrl: null };
                }

                profileForm.value.avatarUrl = null;
                profileForm.value.avatarFile = null;
                if (fileInputRef.value) fileInputRef.value.value = '';

                swalDark.fire({
                    title: 'Eliminada',
                    text: 'Tu foto de perfil ha sido eliminada.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('Error al eliminar avatar:', error);
                swalDark.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al eliminar la imagen de perfil.',
                    icon: 'error'
                });
            } finally {
                saving.value = false;
            }
        };
        </script>

        <template>
            <div class="max-w-4xl mx-auto px-4 py-8">
                <!-- Botón de retorno al Dashboard -->
                <div class="mb-6">
                    <router-link 
                        to="/dashboard" 
                        class="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Dashboard</span>
                    </router-link>
                </div>

                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-slate-100">Mi Perfil</h2>
                    <p class="text-sm text-slate-400">Administra tu información personal y seguridad de la cuenta.</p>
                </div>

                <form @submit.prevent="updateProfile" class="space-y-6">
                    <!-- Sección Avatar & Datos Básicos -->
                    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <UserIcon class="w-5 h-5 text-emerald-400" />
                            Información Personal
                        </h3>

                        <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
                            <div class="relative w-24 h-24 rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0">
                                <img 
                                    v-if="profileForm.avatarUrl" 
                                    :src="profileForm.avatarUrl" 
                                    alt="Avatar de usuario"
                                    class="w-full h-full object-cover" 
                                />
                                <span v-else class="text-3xl font-bold text-emerald-400">
                                    {{ profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U' }}
                                </span>
                            </div>

                            <div class="flex flex-col space-y-2 text-center sm:text-left">
                                <div class="flex gap-3 justify-center sm:justify-start">
                                    <label class="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition-colors">
                                        <span>Cambiar Foto</span>
                                        <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                                    </label>

                                    <!-- Cancelar selección local antes de subir -->
                                    <button 
                                        v-if="profileForm.avatarFile" 
                                        type="button" 
                                        @click="removeAvatarSelection" 
                                        class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-300 rounded-xl transition-colors"
                                    >
                                        Cancelar Selección
                                    </button>

                                    <!-- Eliminar permanentemente de S3/BD -->
                                    <button 
                                        v-else-if="authStore.user?.avatarUrl" 
                                        type="button" 
                                        @click="removeCurrentAvatar" 
                                        class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-red-400 rounded-xl transition-colors"
                                    >
                                        Quitar Foto
                                    </button>
                                </div>
                                <p class="text-xs text-slate-500">JPG, PNG o WEBP. Máximo 2MB.</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nombre Completo</label>
                                <input 
                                    v-model="profileForm.name" 
                                    type="text" 
                                    required 
                                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                />
                            </div>

                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                                <input 
                                    v-model="profileForm.email" 
                                    type="email" 
                                    disabled 
                                    class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed" 
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Sección Seguridad -->
                    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <KeyIcon class="w-5 h-5 text-emerald-400" />
                            Cambiar Contraseña
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Contraseña Actual</label>
                                <input 
                                    v-model="profileForm.currentPassword" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                />
                            </div>

                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nueva Contraseña</label>
                                <input 
                                    v-model="profileForm.newPassword" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button 
                            type="submit" 
                            :disabled="saving" 
                            class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center gap-2"
                        >
                            <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </template>       
        ```
6. Formulario de Registro (`src/views/RegisterView.vue`)
    + Crea el archivo `src/views/RegisterView.vue`:
        ```vue
        <script setup>
            import { ref } from 'vue';
            import { useRouter } from 'vue-router';
            import { useAuthStore } from '../stores/auth.store';

            const authStore = useAuthStore();
            const router = useRouter();

            const hasLogoError = ref(false);

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
                            <span class="font-bold text-xl text-emerald-400">FamilyTree 2026</span>
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
                            <input
                                v-model="form.password"
                                type="password"
                                required
                                class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="authStore.loading"
                            class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
                        </button>
                    </form>

                    <p class="mt-6 text-center text-sm text-slate-400">
                        ¿Ya tienes cuenta?
                        <router-link to="/login" class="text-emerald-400 hover:underline">Inicia sesión</router-link>
                    </p>
                </div>
            </div>
        </template>
        ```
7. Vista Protegida del Dashboard (`src/views/DashboardView.vue`)
    + Crea el archivo `src/views/DashboardView.vue`:
        ```vue
        <script setup>
            import { useRouter } from 'vue-router';
            import { useAuthStore } from '../stores/auth.store';

            const authStore = useAuthStore();
            const router = useRouter();

            const handleLogout = async () => {
                await authStore.logout();
                router.push({ name: 'login' });
            };
        </script>

        <template>
            <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
                <!-- Main Content -->
                <main class="flex-1 p-6 max-w-4xl mx-auto w-full">
                    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
                        <h2 class="text-lg font-semibold text-emerald-400 mb-4">Perfil de Usuario Autenticado</h2>
                        
                        <div class="space-y-3 text-slate-300">
                            <p><strong class="text-slate-100">ID:</strong> {{ authStore.user?.id }}</p>
                            <p><strong class="text-slate-100">Nombre:</strong> {{ authStore.user?.name }}</p>
                            <p><strong class="text-slate-100">Correo:</strong> {{ authStore.user?.email }}</p>
                            <p>
                                <strong class="text-slate-100">Roles:</strong>
                                <span
                                    v-for="role in authStore.userRoles"
                                    :key="role"
                                    class="ml-2 inline-block px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded"
                                >
                                    {{ role }}
                                </span>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </template>
        ```
8. Limpiar `src/App.vue`:
    + Abre `src/App.vue` y reemplaza todo su contenido con esto:
        ```vue
        <script setup>
            import { RouterView } from 'vue-router'
        </script>

        <template>
            <RouterView />
        </template>
        ```
9. Rediseñar la Landing Page (`src/views/HomeView.vue`)
    + Reemplaza el contenido de `src/views/HomeView.vue` para que la raíz / muestre una bienvenida profesional:
        ```vue
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
                        <span v-else class="text-2xl">🌳</span>
                        <span class="font-bold text-lg sm:text-xl text-emerald-400 whitespace-nowrap">FamilyTree 2026</span>
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
                        <span v-else class="text-6xl">🌳</span>
                    </div>

                    <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full mb-6">
                        Starter Kit 2026
                    </span>
                    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
                        Gestiona la historia de tu familia de forma <span class="text-emerald-400">segura y moderna</span>.
                    </h1>
                    <p class="text-slate-400 text-lg mb-8 max-w-xl">
                        Plataforma construida sobre Node.js, Express, PostgreSQL y Vue 3 con autenticación basada en tokens JWT.
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
                    &copy; 2026 FamilyTree. Todos los derechos reservados.
                </footer>
            </div>
        </template>
        ```
10. Crear Vista 404 (`src/views/NotFoundView.vue`)
    + Crea el archivo `src/views/NotFoundView.vue`:
        ```vue
        <template>
            <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl font-black text-emerald-500 mb-2">404</h1>
                <h2 class="text-2xl font-bold mb-4">Página no encontrada</h2>
                <p class="text-slate-400 mb-6 max-w-md">
                    La ruta a la que intentas acceder no existe o ha sido movida a otro lugar.
                </p>
                <router-link
                    to="/"
                    class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-emerald-400 font-medium transition-colors"
                >
                    Volver al Inicio
                </router-link>
            </div>
        </template>
        ```
11. Actualizar las rutas en `src/router/index.js`
    + Añade la ruta comodín al final del arreglo routes en `src/router/index.js`:
        ```js
        // ...
        routes: [
            { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
            { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { requiresGuest: true } },
            { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { requiresGuest: true } },
            {
                // Rutas protegidas que comparten el mismo Navbar sin pestañeos
                path: '/',
                component: () => import('@/layouts/AppLayout.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: 'dashboard',
                        name: 'dashboard',
                        component: () => import('@/views/DashboardView.vue'),
                        meta: { title: 'Dashboard' }
                    },
                    {
                        path: 'profile',
                        name: 'profile',
                        component: () => import('@/views/ProfileView.vue'),
                        meta: { title: 'Configuración de Perfil' }
                    },
                    { 
                        path: '/admin', 
                        name: 'admin-dashboard', 
                        component: () => import('@/views/admin/AdminDashboardView.vue'), 
                        meta: { title: 'Panel de Administración', requiresRole: 'SUPER_ADMIN' } 
                    },
                    {
                        path: 'admin/users',
                        name: 'admin-users',
                        component: () => import('@/views/admin/UsersAdminView.vue'),
                        meta: { title: 'Gestión de Usuarios', requiresRole: 'SUPER_ADMIN' }
                    },
                    { 
                        path: '/admin/roles', 
                        name: 'admin-roles', 
                        component: () => import('@/views/admin/RolesAdminView.vue'), 
                        meta: { title: 'Roles y Permisos', requiresRole: 'SUPER_ADMIN' } 
                    },
                    { 
                        path: '/admin/audit-logs', 
                        name: 'admin-audit-logs', 
                        component: () => import('@/views/admin/AuditLogsView.vue'), 
                        meta: { title: 'Registros de Auditoría', requiresRole: 'SUPER_ADMIN' } 
                    },               
                ]
            },
            { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },  
        ],
        // ...
        ```

## Panel Administrativo
### CRUD usuarios Frontend
1. 📡 Crear el servicio de API (`src/services/admin.service.js`)
    + Crea este archivo para encapsular las peticiones HTTP de administración:
        ```js
        import api from '@/api/axios';

        export const adminService = {
            // Listar usuarios con búsqueda y paginación
            async getUsers(params = {}) {
                const response = await api.get('/admin/users', { params });
                return response.data;
            },

            // Crear un nuevo usuario
            async createUser(userData) {
                const response = await api.post('/admin/users', userData);
                return response.data;
            },

            // Actualizar datos del perfil (nombre y correo)
            async updateUser(userId, userData) {
                const response = await api.put(`/admin/users/${userId}`, userData);
                return response.data;
            },

            // Actualizar roles asignados
            async updateUserRoles(userId, roles) {
                const response = await api.put(`/admin/users/${userId}/roles`, { roles });
                return response.data;
            },

            // Eliminar usuario de la plataforma
            async deleteUser(userId) {
                const response = await api.delete(`/admin/users/${userId}`);
                return response.data;
            }
        };
        ```
2. 🎨 Crear la Vista UsersAdminView.vue (`src/views/admin/UsersAdminView.vue`)
    + Crea la carpeta src/views/admin/ si no existe y añade la vista:
        ```vue
        <template>
            <div class="min-h-screen bg-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Botón de retorno al Panel Admin -->
                <div class="mb-6">
                    <router-link 
                        to="/admin" 
                        class="inline-flex items-center space-x-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors group"
                    >
                        <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Panel Admin</span>
                    </router-link>
                </div>
                <!-- Encabezado -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-white">Gestión de Usuarios</h1>
                        <p class="text-slate-400 text-sm mt-1">Administra los permisos y accesos de la plataforma en tiempo real.</p>                
                    </div>
                    <button
                        @click="openUserModal(null)"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-600/30"
                    >
                        <PlusIcon class="w-5 h-5" />
                        Nuevo Usuario
                    </button>           
                </div>

                <!-- Barra de Búsqueda y Filtros -->
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-4 mb-6">
                    <div class="relative">
                        <input
                            v-model="searchQuery"
                            @input="handleSearch"
                            type="text"
                            placeholder="Buscar por nombre o correo electrónico..."
                            class="w-full bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg px-10 py-2.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                        />
                        <MagnifyingGlassIcon class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                    </div>
                </div>

                <!-- Tabla de Usuarios -->
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                    <div v-if="loading" class="p-12 text-center text-slate-500 dark:text-slate-400">
                        <span class="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-2"></span>
                        <p>Cargando usuarios...</p>
                    </div>

                    <div v-else-if="users.length === 0" class="p-12 text-center text-slate-500 dark:text-slate-400">
                        No se encontraron usuarios que coincidan con la búsqueda.
                    </div>

                    <div v-else class="overflow-x-auto w-full">
                        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead>
                                <tr class="border-b border-slate-700/60 bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider select-none">                            
                                    <!-- Columna Nombre (Usuario) -->
                                    <th @click="handleSort('name')" class="px-6 py-3 text-left cursor-pointer hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Usuario</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'name' && sortOrder === 'asc' ? 'text-emerald-400' : 'text-slate-600'">▲</span>
                                                <span :class="sortBy === 'name' && sortOrder === 'desc' ? 'text-emerald-400' : 'text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>

                                    <!-- Columna Roles (No ordenable) -->
                                    <th class="px-6 py-3 text-left">Roles Asignados</th>

                                    <!-- Columna Fecha Registro -->
                                    <th @click="handleSort('createdAt')" class="px-6 py-3 text-left cursor-pointer hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Fecha Registro</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-emerald-400' : 'text-slate-600'">▲</span>
                                                <span :class="sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-emerald-400' : 'text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>

                                    <th class="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>                    
                            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <!-- Info Usuario -->
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-slate-700 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-200 dark:border-slate-600">
                                                {{ user.name ? user.name.charAt(0) : 'U' }}
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-slate-900 dark:text-slate-200">{{ user.name }}</div>
                                                <div class="text-sm text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Badges de Roles -->
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-wrap gap-1.5">
                                            <span
                                                v-for="role in user.roles"
                                                :key="role"
                                                :class="getRoleBadgeClass(role)"
                                                class="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                                            >
                                                {{ role }}
                                            </span>
                                            <span v-if="user.roles.length === 0" class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                                Sin permisos (Guest)
                                            </span>
                                        </div>
                                    </td>

                                    <!-- Fecha -->
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {{ formatDate(user.createdAt) }}
                                    </td>

                                    <!-- Acciones -->
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="inline-flex items-center justify-end space-x-2">
                                            <button
                                                @click="openUserModal(user)"
                                                title="Editar datos del usuario"
                                                class="h-9 w-9 inline-flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all"
                                            >
                                                <PencilSquareIcon class="w-4 h-4" />
                                            </button>

                                            <button
                                                @click="confirmDeleteUser(user)"
                                                title="Eliminar usuario"
                                                class="h-9 w-9 inline-flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-lg transition-all"
                                            >
                                                <TrashIcon class="w-4 h-4" />
                                            </button>

                                            <button
                                                @click="openRoleModal(user)"
                                                title="Editar Roles"
                                                class="h-9 px-3 inline-flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white rounded-lg transition-all"
                                            >
                                                <UserGroupIcon class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Paginación -->
                    <div v-if="pagination.totalPages > 1" class="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span class="text-sm text-slate-500 dark:text-slate-400">
                            Página {{ pagination.page }} de {{ pagination.totalPages }}
                        </span>
                        <div class="flex gap-2">
                            <button
                                :disabled="pagination.page === 1"
                                @click="changePage(pagination.page - 1)"
                                class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>
                            <button
                                :disabled="pagination.page === pagination.totalPages"
                                @click="changePage(pagination.page + 1)"
                                class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal de Asignación de Roles -->
                <div v-if="selectedUser" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm">
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Gestionar Roles</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Modificando permisos para <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ selectedUser.name }}</span>
                        </p>

                        <div class="space-y-3 mb-6">
                            <label v-for="role in availableRoles" :key="role" class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-300 dark:hover:border-slate-500 transition-colors">
                                <input
                                    type="checkbox"
                                    :value="role"
                                    v-model="modalRoles"
                                    class="w-4 h-4 text-emerald-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500"
                                />
                                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ role }}</span>
                            </label>
                        </div>

                        <div class="flex justify-end gap-3">
                            <button
                                @click="selectedUser = null"
                                class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                @click="saveUserRoles"
                                :disabled="saving"
                                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors"
                            >
                                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Modal de Usuario (Creación / Edición) -->
                <div v-if="isUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm">
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {{ targetUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
                        </h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            {{ targetUser ? `Modificando los datos de ${targetUser.name}` : 'Ingresa la información del nuevo usuario' }}
                        </p>

                        <form @submit.prevent="saveUserData" class="space-y-4">
                            <!-- Nombre -->
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
                                <input
                                    v-model="userForm.name"
                                    type="text"
                                    required
                                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <!-- Email -->
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Correo Electrónico</label>
                                <input
                                    v-model="userForm.email"
                                    type="email"
                                    required
                                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <!-- Contraseña -->
                            <div>
                                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                                    Contraseña {{ targetUser ? '(Opcional / Dejar en blanco)' : '' }}
                                </label>
                                <input
                                    v-model="userForm.password"
                                    type="password"
                                    :required="!targetUser"
                                    placeholder="••••••••"
                                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <!-- Botones -->
                            <div class="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    @click="isUserModalOpen = false"
                                    class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    :disabled="saving"
                                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors"
                                >
                                    {{ saving ? 'Guardando...' : (targetUser ? 'Guardar Cambios' : 'Crear Usuario') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>        
            </div>
        </template>

        <script setup>
            import { TrashIcon, UserGroupIcon, PencilSquareIcon, PlusIcon, ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
            import Swal from 'sweetalert2';
            import { ref, onMounted } from 'vue';
            import { adminService } from '../../services/admin.service';

            // --- ESTADOS GENERALES Y TABLA ---
            const users = ref([]);
            const loading = ref(true);
            const saving = ref(false);
            const searchQuery = ref('');
            const pagination = ref({ page: 1, totalPages: 1, total: 0 });
            let searchTimeout = null;

            // --- ESTADOS PARA EDICIÓN DE ROLES ---
            const selectedUser = ref(null);
            const modalRoles = ref([]);
            const availableRoles = ['SUPER_ADMIN', 'ADMIN', 'USER'];

            // --- ESTADOS PARA CREACIÓN / EDICIÓN COMPLETA DE USUARIO ---
            const isUserModalOpen = ref(false);
            const targetUser = ref(null);
            const userForm = ref({ name: '', email: '', password: '' });

            // --- LÓGICA DE CARGA Y BÚSQUEDA ---
            // Estados de ordenamiento
            const sortBy = ref('createdAt');
            const sortOrder = ref('desc');

            const handleSort = (field) => {
                if (sortBy.value === field) {
                    // Alternar entre ascendente y descendente
                    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
                } else {
                    sortBy.value = field;
                    sortOrder.value = 'asc';
                }
                fetchUsers(1); // Volver a la primera página al reordenar
            };

            // Actualiza tu fetchUsers para enviar estos parámetros
            const fetchUsers = async (page = 1) => {
                loading.value = true;
                try {
                    const res = await adminService.getUsers({
                        search: searchQuery.value,
                        page,
                        limit: 10,
                        sortBy: sortBy.value,
                        sortOrder: sortOrder.value
                    });
                    users.value = res.data.users;
                    pagination.value = res.data.pagination;
                } catch (err) {
                    console.error('Error al cargar usuarios:', err);
                } finally {
                    loading.value = false;
                }
            };      

            const handleSearch = () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    fetchUsers(1);
                }, 300);
            };

            const changePage = (newPage) => {
                fetchUsers(newPage);
            };

            // --- LÓGICA DE ROLES ---
            const openRoleModal = (user) => {
                selectedUser.value = user;
                modalRoles.value = [...user.roles];
            };

            const saveUserRoles = async () => {
                if (!selectedUser.value) return;
                saving.value = true;
                try {
                    await adminService.updateUserRoles(selectedUser.value.id, modalRoles.value);
                    selectedUser.value.roles = [...modalRoles.value];
                    selectedUser.value = null;
                } catch (err) {
                    alert('Error al guardar los roles');
                } finally {
                    saving.value = false;
                }
            };

            // --- LÓGICA DE CREACIÓN / EDICIÓN DE USUARIO ---
            const openUserModal = (user = null) => {
                targetUser.value = user;
                if (user) {
                    // Edición
                    userForm.value = { name: user.name, email: user.email, password: '' };
                } else {
                    // Creación
                    userForm.value = { name: '', email: '', password: '' };
                }
                isUserModalOpen.value = true;
            };

            const saveUserData = async () => {
                saving.value = true;
                try {
                    if (targetUser.value) {
                        // Actualización (si la password viene vacía, el backend no la actualiza)
                        const payload = { ...userForm.value };
                        if (!payload.password) delete payload.password;

                        const res = await adminService.updateUser(targetUser.value.id, payload);
                        
                        // Actualiza en vivo la lista local
                        targetUser.value.name = res.data.user.name;
                        targetUser.value.email = res.data.user.email;
                    } else {
                        // Creación de nuevo usuario
                        await adminService.createUser(userForm.value);
                        await fetchUsers(1); // Recarga la primera página
                    }
                    isUserModalOpen.value = false;
                } catch (err) {
                    alert(err.response?.data?.message || 'Error al procesar la solicitud');
                } finally {
                    saving.value = false;
                }
            };

            // --- LÓGICA DE ELIMINACIÓN CON SWEETALERT2 ---
            const confirmDeleteUser = async (user) => {
                const result = await Swal.fire({
                    title: '¿Eliminar usuario?',
                    html: `Estás a punto de eliminar a <strong>${user.name}</strong>.<br><span class="text-xs text-slate-400">Esta acción no se puede deshacer.</span>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444', // Red-500 de Tailwind
                    cancelButtonColor: '#64748b',  // Slate-500 de Tailwind
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                    background: '#1e293b',         // Slate-800 de Tailwind (Coincide con tu tema)
                    color: '#f8fafc',              // Slate-50 de Tailwind
                    customClass: {
                        popup: 'rounded-xl border border-slate-700 shadow-2xl',
                        confirmButton: 'px-4 py-2 rounded-lg font-medium text-sm',
                        cancelButton: 'px-4 py-2 rounded-lg font-medium text-sm'
                    }
                });

                if (result.isConfirmed) {
                    try {
                        await adminService.deleteUser(user.id);
                        
                        // Notificación flotante de éxito
                        Swal.fire({
                            title: '¡Eliminado!',
                            text: 'El usuario ha sido eliminado correctamente.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            background: '#1e293b',
                            color: '#f8fafc',
                            customClass: {
                                popup: 'rounded-xl border border-slate-700'
                            }
                        });

                        await fetchUsers(pagination.value.page);
                    } catch (err) {
                        Swal.fire({
                            title: 'Error',
                            text: err.response?.data?.message || 'Error al intentar eliminar el usuario',
                            icon: 'error',
                            background: '#1e293b',
                            color: '#f8fafc',
                            customClass: {
                                popup: 'rounded-xl border border-slate-700'
                            }
                        });
                    }
                }
            };    

            // --- UTILITIES DE FORMATO Y ESTILOS ---
            const getRoleBadgeClass = (role) => {
                switch (role) {
                    case 'SUPER_ADMIN':
                        return 'bg-purple-900/40 text-purple-300 border-purple-500/30';
                    case 'ADMIN':
                        return 'bg-blue-900/40 text-blue-300 border-blue-500/30';
                    default:
                        return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30';
                }
            };

            const formatDate = (dateStr) => {
                if (!dateStr) return 'N/A';
                return new Date(dateStr).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                });
            };

            onMounted(() => {
                fetchUsers();
            });   
        </script>
        ```

### Roles y permisos
#### PARTE 3: FRONTEND (Servicio y Vista Vue)
1. Servicio (`familytree2026-frontend/src/services/roles.service.js`)
    + Crea el archivo de servicio API para el módulo de roles:
        ```js
        import api from '@/api/axios';

        export const rolesService = {
            async getRoles() {
                const response = await api.get('/admin/roles');
                return response.data;
            },

            async getPermissions() {
                const response = await api.get('/admin/permissions');
                return response.data;
            },

            async createRole(roleData) {
                const response = await api.post('/admin/roles', roleData);
                return response.data;
            },

            async updateRole(roleId, roleData) {
                const response = await api.put(`/admin/roles/${roleId}`, roleData);
                return response.data;
            },

            async deleteRole(roleId) {
                const response = await api.delete(`/admin/roles/${roleId}`);
                return response.data;
            }
        };
        ```
2. Vista Vue (`familytree2026-frontend/src/views/admin/RolesAdminView.vue`)
    + Crea el componente `RolesAdminView.vue` para la interfaz de gestión de roles y asignación de permisos:
        ```vue
        <template>
            <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
                <div class="p-6 max-w-7xl mx-auto">
                    <!-- Botón Volver al Panel -->
                    <div class="mb-6">
                        <router-link 
                            to="/admin" 
                            class="inline-flex items-center space-x-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group"
                        >
                            <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                            <span>Volver al Panel Admin</span>
                        </router-link>
                    </div>

                    <!-- Encabezado y Acción -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <p class="text-slate-400 text-sm mt-1">
                                Administra los roles del sistema y configura las acciones permitidas para cada uno.
                            </p>
                        </div>
                        <button 
                            @click="openModal()"
                            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-600/30"
                        >
                            <PlusIcon class="w-5 h-5" />
                            <span>Nuevo Rol</span>
                        </button>
                    </div>        

                    <!-- Tabla de Roles -->
                    <div class="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-x-auto shadow-xl">
                        <table class="w-full text-left text-sm text-slate-300">
                            <thead class="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th class="px-6 py-3">Nombre del Rol</th>
                                    <th class="px-6 py-3">Descripción</th>
                                    <th class="px-6 py-3">Usuarios</th>
                                    <th class="px-6 py-3">Permisos Asignados</th>
                                    <th class="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-700/50">
                                <tr v-for="role in roles" :key="role.id" class="hover:bg-slate-700/30 transition-colors">
                                    <td class="px-6 py-4 font-semibold text-white">
                                        <span class="px-2.5 py-1 rounded-full text-xs font-bold border" :class="getRoleBadgeClass(role.name)">
                                            {{ role.name }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-slate-400 max-w-xs truncate">{{ role.description || 'Sin descripción' }}</td>
                                    <td class="px-6 py-4 text-slate-300">{{ role.userCount }} usuario(s)</td>
                                    <!-- Columna Permisos Asignados -->
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <!-- Caso SUPER_ADMIN -->
                                        <span 
                                            v-if="role.name === 'SUPER_ADMIN'"
                                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                        >
                                            Acceso Total (Global)
                                        </span>

                                        <!-- Caso otros roles -->
                                        <span 
                                            v-else
                                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50"
                                        >
                                            {{ role.permissions ? role.permissions.length : 0 }} permiso(s)
                                        </span>
                                    </td>
                                    <!-- Columna Acciones en la tabla -->
                                    <td class="px-6 py-4 whitespace-nowrap text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <button 
                                                @click="openModal(role)"
                                                class="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                                                title="Editar rol"
                                            >
                                                <PencilIcon class="w-4 h-4" />
                                            </button>
                                            
                                            <button 
                                                v-if="role.name !== 'SUPER_ADMIN'"
                                                @click="confirmDelete(role)"
                                                class="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                                                title="Eliminar rol"
                                            >
                                                <TrashIcon class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- MODAL CREACIÓN / EDICIÓN -->
                    <div 
                        v-if="isModalOpen" 
                        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4"
                    >
                        <!-- Contenedor Principal: Limita la altura a max 90% de la pantalla -->
                        <div class="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                            
                            <!-- Header (Fijo arriba) -->
                            <div class="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
                                <h2 class="text-lg font-bold text-white">{{ targetRole ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h2>
                                <button type="button" @click="isModalOpen = false" class="text-slate-400 hover:text-white p-1">✕</button>
                            </div>

                            <!-- Formulario completo integrado con scroll vertical interno -->
                            <form @submit.prevent="saveRole" class="flex flex-col flex-1 overflow-hidden min-h-0">
                                
                                <!-- Cuerpo scrolleable -->
                                <div class="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Nombre del Rol</label>
                                        <input 
                                            v-model="form.name" 
                                            type="text" 
                                            required 
                                            :disabled="targetRole?.name === 'SUPER_ADMIN'"
                                            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                                            placeholder="Ej: EDITOR"
                                        />
                                    </div>

                                    <div>
                                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Descripción</label>
                                        <input 
                                            v-model="form.description" 
                                            type="text" 
                                            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                                            placeholder="Descripción breve de responsabilidades"
                                        />
                                    </div>

                                    <!-- Asignación de Permisos Agrupados por Módulo -->
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-3">Permisos Asignados</label>
                                        
                                        <div v-if="form.name === 'SUPER_ADMIN'" class="p-4 bg-purple-950/40 border border-purple-800/50 rounded-xl text-purple-300 text-xs">
                                            El rol SUPER_ADMIN cuenta con acceso absoluto e irrestricto a todas las funcionalidades del sistema.
                                        </div>
                                        
                                        <div v-else class="space-y-4">
                                            <div v-for="(perms, moduleName) in groupedPermissions" :key="moduleName" class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                                                <h4 class="text-xs font-bold text-purple-400 uppercase mb-3">{{ moduleName }}</h4>
                                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    <label v-for="perm in perms" :key="perm.id" class="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            :value="perm.action" 
                                                            v-model="form.permissions"
                                                            class="rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <span class="break-all">{{ perm.action }}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Footer con Botones (Fijo abajo) -->
                                <div class="flex justify-end space-x-3 p-4 sm:p-6 border-t border-slate-700 bg-slate-800/90 shrink-0">
                                    <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">Cancelar</button>
                                    <button type="submit" :disabled="saving" class="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20">
                                        {{ saving ? 'Guardando...' : 'Guardar Rol' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <script setup>
            import { PlusIcon, PencilIcon, TrashIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline';
            import { ref, computed, onMounted } from 'vue';
            import { rolesService } from '@/services/roles.service';
            import Swal from 'sweetalert2';

            const roles = ref([]);
            const availablePermissions = ref([]);
            const isModalOpen = ref(false);
            const saving = ref(false);
            const targetRole = ref(null);

            const form = ref({
                name: '',
                description: '',
                permissions: []
            });

            // Agrupar permisos por módulo para mostrarlos organizados
            const groupedPermissions = computed(() => {
                return availablePermissions.value.reduce((acc, perm) => {
                    if (!acc[perm.module]) acc[perm.module] = [];
                    acc[perm.module].push(perm);
                    return acc;
                }, {});
            });

            const loadData = async () => {
                try {
                    const [rolesRes, permsRes] = await Promise.all([
                        rolesService.getRoles(),
                        rolesService.getPermissions()
                    ]);
                    roles.value = rolesRes.data.roles;
                    availablePermissions.value = permsRes.data.permissions;
                } catch (err) {
                    console.error('Error al cargar datos:', err);
                }
            };

            const openModal = (role = null) => {
                targetRole.value = role;
                if (role) {
                    form.value = {
                        name: role.name,
                        description: role.description || '',
                        permissions: [...role.permissions]
                    };
                } else {
                    form.value = { name: '', description: '', permissions: [] };
                }
                isModalOpen.value = true;
            };

            const saveRole = async () => {
                saving.value = true;
                try {
                    if (targetRole.value) {
                        await rolesService.updateRole(targetRole.value.id, form.value);
                    } else {
                        await rolesService.createRole(form.value);
                    }
                    isModalOpen.value = false;
                    await loadData();
                    
                    Swal.fire({
                        title: '¡Guardado!',
                        text: 'El rol ha sido guardado exitosamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#1e293b',
                        color: '#f8fafc'
                    });
                } catch (err) {
                    Swal.fire({
                        title: 'Error',
                        text: err.response?.data?.message || 'Error al guardar el rol',
                        icon: 'error',
                        background: '#1e293b',
                        color: '#f8fafc'
                    });
                } finally {
                    saving.value = false;
                }
            };

            const confirmDelete = async (role) => {
                const result = await Swal.fire({
                    title: '¿Eliminar Rol?',
                    html: `Estás a punto de eliminar el rol <strong>${role.name}</strong>.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                    background: '#1e293b',
                    color: '#f8fafc'
                });

                if (result.isConfirmed) {
                    try {
                        await rolesService.deleteRole(role.id);
                        await loadData();
                    } catch (err) {
                        Swal.fire({
                            title: 'Error',
                            text: err.response?.data?.message || 'Error al eliminar el rol',
                            icon: 'error',
                            background: '#1e293b',
                            color: '#f8fafc'
                        });
                    }
                }
            };

            const getRoleBadgeClass = (name) => {
                switch (name) {
                    case 'SUPER_ADMIN': return 'bg-purple-900/40 text-purple-300 border-purple-500/30';
                    case 'ADMIN': return 'bg-blue-900/40 text-blue-300 border-blue-500/30';
                    default: return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30';
                }
            };

            onMounted(() => {
                loadData();
            });
        </script>
        ```

### Sección de Auditoría y Logs
#### Paso 4: Servicio Axios en el Frontend Vue 3
+ Añadimos el método para consultar los logs en el cliente API en `src/services/admin.service.js`:
    ```js
    // ...
    export const adminService = {
        // ... otros métodos previos (getUsers, updateUser, etc.)

        getAuditLogs(params = {}) {
            return api.get('/admin/audit-logs', { params });
        },
    };
    ```

#### Paso 5: Vista de Auditoría y Logs en Vue 3 (`AuditLogsView.vue`)
+ Vista optimizada con Tailwind v4, selector de fechas, visualización JSON para detalles y badge por tipo de entidad.
1. Creamos la vista `src/views/admin/AuditLogsView.vue`:
    ```vue
    <template>
        <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <div class="p-6 max-w-7xl mx-auto space-y-6">
                <!-- Botón de retorno al Panel Admin -->
                <div class="mb-6">
                    <router-link 
                        to="/admin" 
                        class="inline-flex items-center space-x-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors group"
                    >
                        <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Panel Admin</span>
                    </router-link>
                </div>
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Historial detallado de actividad y acciones ejecutadas.</p>
                    </div>
                    <button 
                        @click="fetchLogs" 
                        class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-800 hover:bg-yellow-700 text-white rounded-xl text-sm font-medium transition-colors w-fit"
                    >
                        <span>Refrescar</span>
                    </button>
                </div>

                <!-- Filtros -->
                <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Buscar</label>
                        <input 
                            v-model="filters.search" 
                            @input="debounceSearch"
                            type="text" 
                            placeholder="Acción, usuario, email..." 
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Entidad</label>
                        <select 
                            v-model="filters.entity" 
                            @change="fetchLogs(1)"
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Todas</option>
                            <option value="User">Usuario</option>
                            <option value="Auth">Autenticación</option>
                            <option value="Role">Rol</option>
                            <option value="SystemLog">Sistema</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Desde</label>
                        <input 
                            ref="startDateInput"
                            type="text" 
                            placeholder="Seleccionar fecha..."
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Hasta</label>
                        <input 
                            ref="endDateInput"
                            type="text" 
                            placeholder="Seleccionar fecha..."
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        />
                    </div>
                </div>

                <!-- Tabla -->
                <div class="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider select-none">
                                    <!-- Fecha / Hora -->
                                    <th @click="handleSort('createdAt')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Fecha / Hora</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                                <span :class="sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>

                                    <!-- Usuario -->
                                    <th @click="handleSort('user')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Usuario</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'user' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                                <span :class="sortBy === 'user' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>

                                    <!-- Acción -->
                                    <th @click="handleSort('action')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Acción</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'action' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                                <span :class="sortBy === 'action' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>

                                    <!-- Entidad -->
                                    <th @click="handleSort('entity')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <div class="flex items-center space-x-1">
                                            <span>Entidad</span>
                                            <span class="inline-flex flex-col text-[10px] leading-none">
                                                <span :class="sortBy === 'entity' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                                <span :class="sortBy === 'entity' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                            </span>
                                        </div>
                                    </th>

                                    <!-- IP (Sin ordenamiento dinámico) -->
                                    <th class="py-3 px-4 text-left">IP</th>

                                    <!-- Detalles -->
                                    <th class="py-3 px-4 text-right">Detalles</th>
                                </tr>
                            </thead>                   
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                                <tr v-if="loading">
                                    <td colspan="6" class="text-center py-8 text-slate-400">Cargando registros...</td>
                                </tr>
                                <tr v-else-if="logs.length === 0">
                                    <td colspan="6" class="text-center py-8 text-slate-400">No se encontraron eventos.</td>
                                </tr>
                                <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td class="py-3 px-4 font-mono text-xs whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
                                    <td class="py-3 px-4">
                                        <div v-if="log.user" class="flex flex-col">
                                            <span class="font-medium text-slate-900 dark:text-white">{{ log.user.name }}</span>
                                            <span class="text-xs text-slate-400">{{ log.user.email }}</span>
                                        </div>
                                        <span v-else class="text-xs text-slate-400 italic">Sistema / Anónimo</span>
                                    </td>
                                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{{ log.action }}</td>
                                    <td class="py-3 px-4">
                                        <span :class="getEntityBadgeClass(log.entity)" class="px-2.5 py-1 text-[11px] font-semibold rounded-lg border">
                                            {{ log.entity }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 font-mono text-xs text-slate-400">{{ log.ipAddress || 'N/A' }}</td>
                                    <td class="py-3 px-4 text-right">
                                        <button 
                                            v-if="log.details" 
                                            @click="openDetailsModal(log)" 
                                            class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                                        >
                                            Ver JSON
                                        </button>
                                        <span v-else class="text-xs text-slate-400">-</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Paginación -->
                    <div class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700">
                        <span class="text-xs text-slate-500 dark:text-slate-400">
                            Mostrando página {{ pagination.page }} de {{ pagination.totalPages }} ({{ pagination.total }} registros)
                        </span>
                        <div class="flex gap-2">
                            <button 
                                :disabled="pagination.page <= 1" 
                                @click="changePage(pagination.page - 1)" 
                                class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40"
                            >
                                Anterior
                            </button>
                            <button 
                                :disabled="pagination.page >= pagination.totalPages" 
                                @click="changePage(pagination.page + 1)" 
                                class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Modal de Detalles JSON -->
                <div v-if="selectedLogModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <div class="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-1">
                            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Detalles del Evento</h3>
                            <span class="text-xs text-slate-400 font-mono">{{ selectedLogModal.action }} - {{ formatDate(selectedLogModal.createdAt) }}</span>
                        </div>                
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-y-auto overflow-x-hidden max-h-[50vh] max-w-full">
                            <pre class="text-emerald-400 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed select-all">{{ formatJsonDetails(selectedLogModal.details) }}</pre>
                        </div>
                        <div class="flex justify-end">
                            <button 
                                @click="selectedLogModal = null" 
                                class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <script setup>
        import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
        import { ref, onMounted, onUnmounted } from 'vue';
        import { adminService } from '@/services/admin.service';
        import flatpickr from 'flatpickr';
        import 'flatpickr/dist/flatpickr.css';
        import 'flatpickr/dist/themes/dark.css';
        import { Spanish } from 'flatpickr/dist/l10n/es.js';

        const logs = ref([]);
        const loading = ref(false);
        const selectedLogModal = ref(null);

        const startDateInput = ref(null);
        const endDateInput = ref(null);
        let fpStart = null;
        let fpEnd = null;

        const filters = ref({
            search: '',
            entity: '',
            startDate: '',
            endDate: '',
        });

        const pagination = ref({
            page: 1,
            total: 0,
            totalPages: 1,
        });

        const sortBy = ref('createdAt');
        const sortOrder = ref('desc');
        
        const handleSort = (field) => {
            if (sortBy.value === field) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortBy.value = field;
                sortOrder.value = 'asc';
            }
            fetchLogs(1);
        };

        const fetchLogs = async (page = 1) => {
            // Si 'page' es un evento DOM o no es un número válido, forzamos página 1
            const targetPage = (typeof page === 'number' && !isNaN(page)) ? page : 1;
            
            pagination.value.page = targetPage;
            loading.value = true;

            try {
                const response = await adminService.getAuditLogs({
                    page: pagination.value.page,
                    limit: pagination.value.limit || 15,
                    search: filters.value.search,
                    entity: filters.value.entity,
                    action: filters.value.action,
                    startDate: filters.value.startDate,
                    endDate: filters.value.endDate,
                    sortBy: sortBy.value,
                    sortOrder: sortOrder.value
                });

                const resData = response.data?.data || response.data || {};
                logs.value = resData.logs || [];
                pagination.value = resData.pagination || { page: 1, total: 0, totalPages: 1 };
            } catch (err) {
                console.error('Error al cargar logs:', err);
                logs.value = [];
            } finally {
                loading.value = false;
            }
        }; 

        let searchTimeout = null;
        const debounceSearch = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                pagination.value.page = 1;
                fetchLogs();
            }, 400);
        };

        const changePage = (newPage) => {
            // Validar límites antes de hacer la petición
            if (newPage < 1 || newPage > pagination.value.totalPages) return;
            
            // Pasar 'newPage' directamente a fetchLogs
            fetchLogs(newPage);
        };    

        const openDetailsModal = (log) => {
            selectedLogModal.value = log;
        };

        const getEntityBadgeClass = (entity) => {
            switch (entity) {
                case 'User': return 'bg-blue-500/10 text-emerald-500 border-emerald-500/20';
                case 'Role': return 'bg-emerald-500/10 text-purple-500 border-purple-500/20';
                case 'Auth': return 'bg-amber-500/10 text-blue-500 border-blue-500/20';
                default: return 'bg-yellow-500/10 text-yellow-400 border-slate-500/20';
            }
        };

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleString('es-ES', {
                dateStyle: 'short',
                timeStyle: 'medium',
            });
        };

        const formatJsonDetails = (details) => {
            if (!details) return '';
            try {
                // Si viene como String, lo parseamos a Objeto. Si ya es Objeto, lo dejamos igual.
                const parsed = typeof details === 'string' ? JSON.parse(details) : details;
                return JSON.stringify(parsed, null, 2);
            } catch (e) {
                // Si no es un JSON válido, retornamos el texto tal cual
                return details;
            }
        };
        
        onMounted(() => {
            fetchLogs();

            const commonConfig = {
                locale: Spanish,
                dateFormat: 'Y-m-d',
                altInput: true,
                altFormat: 'd/m/Y',
                allowInput: true,
            };

            fpStart = flatpickr(startDateInput.value, {
                ...commonConfig,
                onChange: (selectedDates, dateStr) => {
                    filters.value.startDate = dateStr;
                    pagination.value.page = 1;
                    fetchLogs();
                },
            });

            fpEnd = flatpickr(endDateInput.value, {
                ...commonConfig,
                onChange: (selectedDates, dateStr) => {
                    filters.value.endDate = dateStr;
                    pagination.value.page = 1;
                    fetchLogs();
                },
            });
        });

        onUnmounted(() => {
            if (fpStart) fpStart.destroy();
            if (fpEnd) fpEnd.destroy();
        });
    </script>
    ```
2. Registrar la ruta en Vue Router:
    + Abre tu archivo de rutas en el frontend `src/router/index.js` y añade la ruta en la sección de administración:
        ```js
        const router = createRouter({
            history: createWebHistory(import.meta.env.BASE_URL),
            routes: [
                // ...
                { 
                    path: '/admin/audit-logs', 
                    name: 'admin-audit-logs', 
                    component: () => import('@/views/admin/AuditLogsView.vue'), 
                    meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' } 
                },    
                // ...
            ],
        });
        ```



### Módulo Administrativo
1. Crear vista administrativa `src/views/admin/AdminDashboardView.vue`:
    ```vue
    <template>
        <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <div class="p-6 max-w-7xl mx-auto">        
                <!-- Botón de retorno al Dashboard Principal -->
                <div class="mb-6">
                    <router-link 
                        to="/dashboard" 
                        class="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Dashboard</span>
                    </router-link>
                </div>        
                <div class="mb-8">
                    <p class="text-slate-400 text-sm">Gestiona la configuración global de la plataforma, accesos y permisos.</p>
                </div>

                <!-- Grid de Accesos Directos a Módulos Admin -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <!-- Módulo: Usuarios -->
                    <router-link 
                        to="/admin/users" 
                        class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
                    >
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                                <UsersIcon class="w-6 h-6" />
                            </div>
                            <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Activo</span>
                        </div>
                        <h2 class="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">Gestión de Usuarios</h2>
                        <p class="text-slate-400 text-xs mt-1">Creación, edición de datos personales, asignación de roles y eliminación.</p>
                    </router-link>

                    <!-- Módulo: Roles y Permisos -->
                    <router-link 
                        to="/admin/roles" 
                        class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-purple-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
                    >
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                                <ShieldCheckIcon class="w-6 h-6" />
                            </div>
                            <span class="text-xs font-semibold px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">Dev / Config</span>
                        </div>
                        <h2 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">Roles y Permisos</h2>
                        <p class="text-slate-400 text-xs mt-1">Administración de la tabla de roles globales del sistema (CRUD de Roles).</p>
                    </router-link>

                    <!-- Módulo: Logs de Auditoría / Sistema -->
                    <router-link 
                        to="/admin/audit-logs" 
                        class="group p-6 bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
                    >
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl group-hover:scale-110 transition-transform">
                                <DocumentChartBarIcon class="w-6 h-6" />
                            </div>
                            <span class="text-xs font-semibold px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">Sistema</span>
                        </div>
                        <h2 class="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">Auditoría / Logs</h2>
                        <p class="text-slate-400 text-xs mt-1">Historial de cambios críticos y acciones de los administradores.</p>
                    </router-link>            

                </div>
            </div>
        </div>
    </template>

    <script setup>
        import { ChevronLeftIcon, UsersIcon, ShieldCheckIcon, DocumentChartBarIcon } from '@heroicons/vue/24/outline';
    </script>
    ```
2. 🛣️ Registrar la Ruta y Guard de Navegación (`src/router/index.js`)
    + Añade la ruta en tu router asegurándote de restringir el acceso solo a usuarios con rol SUPER_ADMIN:    
        ```js
        { path: '/admin', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' } },
        { path: '/admin/users', name: 'admin-users', component: () => import('../views/admin/UsersAdminView.vue'), meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' }, },
        { path: '/admin/roles', name: 'admin-roles', component: () => import('@/views/admin/RolesAdminView.vue'), meta: { requiresAuth: true, requiresRole: 'SUPER_ADMIN' } }
        ```
    + Y actualiza el beforeEach para validar el meta requiresRole:
        ```js
        router.beforeEach(async (to) => {
            const authStore = useAuthStore();

            if (authStore.token && !authStore.user) {
                await authStore.fetchUser();
            }

            const isAuthenticated = authStore.isAuthenticated;

            if (to.meta.requiresAuth && !isAuthenticated) {
                return { name: 'login' };
            }

            if (to.meta.requiresGuest && isAuthenticated) {
                return { name: 'dashboard' };
            }

            // Validación de Rol para rutas de administración
            if (to.meta.requiresRole) {
                const userRoles = authStore.user?.roles || [];
                if (!userRoles.includes(to.meta.requiresRole)) {
                    return { name: 'dashboard' }; // Redirige al dashboard si no posee el rol
                }
            }

            return true;
        });
        ```

## Crear el Helper de IP y Contexto
### Auditoria para eventos de usuarios y autenticación
3. Actualización de `src/app.js`:
    + Importa `setAuditUser` y regístralo globalmente antes de las rutas de la API:
        ```js
        const express = require('express');
        const cors = require('cors');
        require('dotenv').config();

        // Middlewares
        const { setAuditUser } = require('./middlewares/auditContext.middleware');  // <- Nuevo middleware para establecer el contexto de auditoría

        // ...

        app.use(cors({
            // ...
        }));
        app.use(express.json());

        // Contexto de auditoría global para envolver la petición HTTP
        app.use(setAuditUser);  // <- Nuevo middleware para establecer el contexto de auditoría 

        // ...
        ```

### Auditoria para eventos de sistemas
#### Paso 2: Registrar el Middleware y Capturadores Globales en Express
1. En tu archivo principal `src/app.js`, conecta el middleware al final de todas tus rutas. Agrega también los eventos de proceso para fallos fuera del ciclo HTTP:
    ```js
    const express = require('express');
    const cors = require('cors');
    require('dotenv').config();

    // Middleware para establecer el contexto de auditoría
    const { setAuditUser } = require('./middlewares/auditContext.middleware');
    // Middleware para manejo global de errores de sistema
    const { errorHandler } = require('./middlewares/error.middleware');             // <- Nuevo

    // Rutas
    const authRoutes = require('./routes/auth.routes');
    const adminRoutes = require('./routes/admin.routes');
    // ...
    /* Inicio nuevo bloque */
    // --- MANEJO DE ERRORES GLOBALES (Debe ser el último app.use) ---
    app.use(errorHandler);

    // --- CAPTURA DE ERRORES FUERA DEL CICLO HTTP ---
    process.on('unhandledRejection', (reason) => {
        console.error('🔥 [CRITICAL] Promesa no capturada (unhandledRejection):', reason);
    });

    process.on('uncaughtException', (error) => {
        console.error('🔥 [CRITICAL] Excepción no controlada (uncaughtException):', error);
    });
    /* Fin nuevo bloque */

    // Inicialización del Servidor
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        console.log(`📌 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
    ```
3. Probar funcionamiento:
    + Agregar el siguiente endpoint en `familytree2026-backend/src/app.js`:
        ```js
        // Ruta temporal para probar captura de errores
        app.get('/api/v1/test-error', async (req, res) => {
            // Simulamos un error no controlado (ej. propiedad indefinida)
            const nullObject = null;
            nullObject.triggerError(); 
        });        
        ```
    + Ejecutar:
        ```bash
        curl http://localhost:4000/api/v1/test-error
        ```



## Habilitar CORS Dinámico 
### En el backend (`src/app.js`)
1. Modificar `src/app.js`:
    ```js
    const allowedOrigins = [
        process.env.FRONTEND_URL_PROD,
        process.env.FRONTEND_URL_LOCAL_VITE,
        process.env.FRONTEND_URL_LOCAL_VUE_CLI,
    ].filter(Boolean);

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('No permitido por CORS'));
            }
        },
        credentials: true
    }));
    ```

### Consumo dinámico de la API en el Frontend (`src/api/axios.js`)
+ Modificar `src/api/axios.js`:
    ```js
    import axios from 'axios';

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
        headers: { 'Content-Type': 'application/json' },
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    export default api;
    ```


## -------------------------


## -------------------------


### Url

#### Frontend
1. Home:
    + Dev:  `http://localhost:5173`
    + Prod: `https://familytree2026.vercel.app`
2. Prueba de Registro:
    + Dev:  `http://localhost:5173/register`
    + Prod: `https://familytree2026.vercel.app/register`
3. Prueba de Vista Protegida:
    + Dev:  `http://localhost:5173/dashboard`
    + Prod: `https://familytree2026.vercel.app/dashboard`
4. Prueba de Rehidratación de Sesión (Persistence):
    + Presiona F5 (Recargar página). El Navigation Guard debe ejecutar `fetchUser()`, validar el token contra el endpoint GET `/me` y mantenerte en `/dashboard` sin cerrar tu sesión.
5. Prueba de Cierre de Sesión:
    + Haz clic en el botón Cerrar Sesión. Debe limpiar el localStorage, borrar el usuario de Pinia y redirigirte a `/login`.
6. Prueba de Protección de Rutas:
    + Estando deslogueado, intenta escribir manualmente `http://localhost:5173/dashboard` en la barra de direcciones. El Navigation Guard debe rebotarte de inmediato a `/login`.


