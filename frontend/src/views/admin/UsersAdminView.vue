<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
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
                    <p class="text-slate-400 text-sm mt-1">Administra los permisos y accesos de la plataforma en tiempo real.</p>                
                </div>
                <button
                    v-if="authStore.hasPermission('users:create')"
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
                                        <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-slate-700 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-200 dark:border-slate-600 overflow-hidden shrink-0">
                                            <!-- Si tiene avatar, muestra la imagen -->
                                            <img 
                                                v-if="user.avatarUrl || user.avatar" 
                                                :src="user.avatarUrl || user.avatar" 
                                                :alt="user.name"
                                                class="w-full h-full object-cover" 
                                            />
                                            <!-- Si no tiene avatar, muestra la inicial -->
                                            <span v-else>
                                                {{ user.name ? user.name.charAt(0) : 'U' }}
                                            </span>
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
                                        <!-- Editar Usuario: requiere users:update -->
                                        <button
                                            v-if="authStore.hasPermission('users:update')"
                                            @click="openUserModal(user)"
                                            title="Editar datos del usuario"
                                            class="h-9 w-9 inline-flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all"
                                        >
                                            <PencilSquareIcon class="w-4 h-4" />
                                        </button>

                                        <!-- Eliminar Usuario: requiere users:delete -->
                                        <button
                                            v-if="authStore.hasPermission('users:delete')"
                                            @click="confirmDeleteUser(user)"
                                            title="Eliminar usuario"
                                            class="h-9 w-9 inline-flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-lg transition-all"
                                        >
                                            <TrashIcon class="w-4 h-4" />
                                        </button>

                                        <!-- Editar Roles: requiere roles:update -->
                                        <button
                                            v-if="authStore.hasPermission('roles:update')"
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

                        <!-- Foto de Perfil -->
                        <div class="mb-4 flex items-center space-x-4">
                            <div class="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600 shrink-0">
                                <img 
                                    v-if="userForm.avatarUrl" 
                                    :src="userForm.avatarUrl" 
                                    :alt="userForm.name"
                                    class="w-full h-full object-cover" 
                                />
                                <span v-else class="text-xl font-bold text-emerald-500 dark:text-emerald-400">
                                    {{ userForm.name ? userForm.name.charAt(0).toUpperCase() : 'U' }}
                                </span>

                                <!-- Overlay de Carga durante la Subida -->
                                <div v-if="uploadingAvatar" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                </div>
                            </div>

                            <div class="flex flex-col space-y-2">
                                <label class="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs text-slate-700 dark:text-slate-200 font-medium rounded-lg border border-slate-300 dark:border-slate-600 transition-colors inline-block text-center">
                                    <span>{{ uploadingAvatar ? 'Subiendo...' : 'Subir imagen' }}</span>
                                    <input 
                                        ref="fileInputRef" 
                                        type="file" 
                                        accept="image/*" 
                                        class="hidden" 
                                        :disabled="uploadingAvatar"
                                        @change="handleAvatarChange" 
                                    />
                                </label>

                                <button 
                                    v-if="userForm.avatarUrl" 
                                    type="button" 
                                    :disabled="uploadingAvatar"
                                    @click="removeAvatar"
                                    class="text-xs text-red-500 hover:text-red-400 text-left transition-colors disabled:opacity-50"
                                >
                                    Eliminar imagen
                                </button>
                            </div>
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
                                :disabled="saving || uploadingAvatar"
                                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors"
                            >
                                {{ saving ? 'Guardando...' : (targetUser ? 'Guardar Cambios' : 'Crear Usuario') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>     
        </div>
    </div>
</template>

<script setup>
    import { TrashIcon, UserGroupIcon, PencilSquareIcon, PlusIcon, ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
    import Swal from 'sweetalert2';
    import { ref, onMounted } from 'vue';
    import { userService, roleService } from '@/services';
    import { useAuthStore } from '@/stores/auth.store';

    // Instancia del store para acceder a los getters
    const authStore = useAuthStore();

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
    const availableRoles = ref([]);

    // --- ESTADOS PARA CREACIÓN / EDICIÓN COMPLETA DE USUARIO ---
    const isUserModalOpen = ref(false);
    const targetUser = ref(null);
    const fileInputRef = ref(null);
    const uploadingAvatar = ref(false);

    const userForm = ref({
        name: '',
        email: '',
        password: '',
        avatarUrl: null,
        avatarFile: null
    });

    // Manejar cambio/subida de imagen
    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (targetUser.value) {
            uploadingAvatar.value = true;
            try {
                // Asegurar que file sea una instancia válida de Blob/File
                const formData = new FormData();
                formData.append('avatar', file, file.name);

                const res = await userService.uploadUserAvatarById(targetUser.value.id, formData);
                
                const updatedAvatar = res.data?.user?.avatarUrl || URL.createObjectURL(file);
                userForm.value.avatarUrl = updatedAvatar;
                targetUser.value.avatarUrl = updatedAvatar;
                targetUser.value.avatar = updatedAvatar;
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: err.response?.data?.message || 'Error al subir la imagen',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#f8fafc'
                });
            } finally {
                uploadingAvatar.value = false;
            }
        } else {
            userForm.value.avatarFile = file;
            userForm.value.avatarUrl = URL.createObjectURL(file);
        }
    };
    
    // Eliminar foto de perfil
    const removeAvatar = async () => {
        if (targetUser.value) {
            // MODO EDICIÓN: Invoca directamente el nuevo endpoint DELETE /api/v1/users/:id/avatar
            uploadingAvatar.value = true;
            try {
                await userService.deleteUserAvatarById(targetUser.value.id);
                
                userForm.value.avatarUrl = null;
                userForm.value.avatarFile = null;
                targetUser.value.avatarUrl = null;
                targetUser.value.avatar = null;
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: err.response?.data?.message || 'Error al eliminar la imagen',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#f8fafc'
                });
            } finally {
                uploadingAvatar.value = false;
            }
        } else {
            // MODO CREACIÓN: Limpia los campos locales
            userForm.value.avatarFile = null;
            userForm.value.avatarUrl = null;
        }

        if (fileInputRef.value) {
            fileInputRef.value.value = '';
        }
    };      

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
            const res = await userService.getUsers({
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
            await userService.updateUserRoles(selectedUser.value.id, modalRoles.value);
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
            userForm.value = { 
                name: user.name, 
                email: user.email, 
                avatarUrl: user.avatarUrl || user.avatar || null,
                avatarFile: null,
                password: '' 
            };
        } else {
            userForm.value = { name: '', email: '', password: '', avatarUrl: null, avatarFile: null };
        }
        isUserModalOpen.value = true;
    };

    // Guardar datos del usuario (Submit)
    const saveUserData = async () => {
        saving.value = true;
        try {
            if (targetUser.value) {
                // Edición de datos básicos
                const payload = { 
                    name: userForm.value.name, 
                    email: userForm.value.email 
                };
                if (userForm.value.password) payload.password = userForm.value.password;

                const res = await userService.updateUser(targetUser.value.id, payload);
                
                targetUser.value.name = res.data.user.name;
                targetUser.value.email = res.data.user.email;
            } else {
                // 1. Crear nuevo usuario
                const res = await userService.createUser({
                    name: userForm.value.name,
                    email: userForm.value.email,
                    password: userForm.value.password
                });

                const newUserId = res.data.user.id;

                // 2. Si seleccionó un avatar en la creación, subirlo ahora con el nuevo ID
                if (userForm.value.avatarFile && newUserId) {
                    const formData = new FormData();
                    formData.append('avatar', userForm.value.avatarFile);
                    await userService.uploadUserAvatarById(newUserId, formData);
                }

                await fetchUsers(1);
            }
            isUserModalOpen.value = false;
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.response?.data?.message || 'Error al procesar la solicitud',
                icon: 'error',
                background: '#1e293b',
                color: '#f8fafc'
            });
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
                await userService.deleteUser(user.id);
                
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
            case 'USER':
                return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30';
            default:
                return 'bg-yellow-900/40 text-yellow-300 border-yellow-500/30';
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
    
    const fetchAvailableRoles = async () => {
        try {
            const res = await roleService.getRoles();
            // Mapeamos para obtener únicamente los nombres en string
            const rolesData = res.data.roles || res.data;
            availableRoles.value = rolesData.map((r) => (typeof r === 'object' ? r.name : r));
        } catch (err) {
            console.error('Error al cargar roles disponibles:', err);
        }
    };    

    onMounted(() => {
        fetchUsers();
        fetchAvailableRoles();
    });   
</script>