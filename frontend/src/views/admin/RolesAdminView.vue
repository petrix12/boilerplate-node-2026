<!-- src/views/admin/RolesAdminView.vue -->
<script setup>
import { PlusIcon, PencilIcon, TrashIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline';
import { ref, computed, onMounted } from 'vue';
import { roleService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';
import { getSwalTheme } from '@/utils/swal';

// Instancia del store para acceder a los getters
const authStore = useAuthStore();

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
            roleService.getRoles(),
            roleService.getPermissions()
        ]);
        roles.value = rolesRes.data?.roles || rolesRes.roles || [];
        availablePermissions.value = permsRes.data?.permissions || permsRes.permissions || [];
    } catch (err) {
        console.error('Error al cargar datos:', err);
        getSwalTheme().fire({
            title: 'Error',
            text: 'No se pudieron cargar los roles y permisos.',
            icon: 'error'
        });
    }
};

const openModal = (role = null) => {
    targetRole.value = role;
    if (role) {
        const rolePerms = Array.isArray(role.permissions) ? role.permissions : [];
        form.value = {
            name: role.name,
            description: role.description || '',
            permissions: rolePerms.map(p => typeof p === 'object' ? p.action : p)
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
            await roleService.updateRole(targetRole.value.id, form.value);
        } else {
            await roleService.createRole(form.value);
        }
        isModalOpen.value = false;
        await loadData();
        
        getSwalTheme().fire({
            title: '¡Guardado!',
            text: 'El rol ha sido guardado exitosamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (err) {
        getSwalTheme().fire({
            title: 'Error',
            text: err.response?.data?.message || 'Error al guardar el rol',
            icon: 'error'
        });
    } finally {
        saving.value = false;
    }
};

const confirmDelete = async (role) => {
    if (role.name === 'SUPER_ADMIN') {
        getSwalTheme().fire({
            title: 'Acción No Permitida',
            text: 'El rol SUPER_ADMIN es un rol de sistema y no puede ser eliminado.',
            icon: 'error'
        });
        return;
    }

    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await getSwalTheme().fire({
        title: '¿Eliminar Rol?',
        html: `Estás a punto de eliminar el rol <strong>${role.name}</strong>.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: isDarkTheme ? 'rounded-xl border border-slate-700 shadow-2xl' : 'rounded-xl border border-slate-200 shadow-2xl',
            confirmButton: 'px-4 py-2 rounded-lg font-medium text-sm bg-red-600 hover:bg-red-500 text-white transition-colors mr-3',
            cancelButton: isDarkTheme 
                ? 'px-4 py-2 rounded-lg font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                : 'px-4 py-2 rounded-lg font-medium text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors'
        }
    });

    if (result.isConfirmed) {
        try {
            await roleService.deleteRole(role.id);
            
            // Notificación de éxito al eliminar
            getSwalTheme().fire({
                title: '¡Eliminado!',
                text: 'El rol ha sido eliminado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            await loadData();
        } catch (err) {
            getSwalTheme().fire({
                title: 'Error',
                text: err.response?.data?.message || 'Error al eliminar el rol',
                icon: 'error'
            });
        }
    }
};

const getRoleBadgeClass = (name) => {
    switch (name) {
        case 'SUPER_ADMIN': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
        case 'ADMIN': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
        case 'USER': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30';
        default: return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500/30';
    }
};

onMounted(() => {
    loadData();
});
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
        <div class="p-6 max-w-7xl mx-auto w-full space-y-6">
            
            <!-- Cabecera envuelta en tarjeta -->
            <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <!-- Botón Volver al Panel -->
                <div class="mb-4">
                    <router-link 
                        to="/admin" 
                        class="inline-flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group"
                    >
                        <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Panel Admin</span>
                    </router-link>
                </div>

                <!-- Título, Descripción y Acción -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <span>Gestión de Roles</span>
                        </h1>
                        <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            Administra los roles del sistema y configura las acciones permitidas para cada uno.
                        </p>
                    </div>
                    <button 
                        v-if="authStore.hasPermission('roles:create')"
                        @click="openModal()"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-600/30 shrink-0"
                    >
                        <PlusIcon class="w-5 h-5" />
                        <span>Nuevo Rol</span>
                    </button>
                </div>
            </div>        

            <!-- Tabla de Roles -->
            <div class="w-full bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-x-auto shadow-xl">
                <table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead class="bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <tr>
                            <th class="px-6 py-3">Nombre del Rol</th>
                            <th class="px-6 py-3">Descripción</th>
                            <th class="px-6 py-3">Usuarios</th>
                            <th class="px-6 py-3">Permisos Asignados</th>
                            <th class="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
                        <tr v-for="role in roles" :key="role.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold border" :class="getRoleBadgeClass(role.name)">
                                    {{ role.name }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{{ role.description || 'Sin descripción' }}</td>
                            <td class="px-6 py-4 text-slate-700 dark:text-slate-300">{{ role.userCount }} usuario(s)</td>
                            <!-- Columna Permisos Asignados -->
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span 
                                    v-if="role.name === 'SUPER_ADMIN'"
                                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/20"
                                >
                                    Acceso Total (Global)
                                </span>
                                <span 
                                    v-else
                                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600/50"
                                >
                                    {{ role.permissions ? role.permissions.length : 0 }} permiso(s)
                                </span>
                            </td>
                            <!-- Columna Acciones en la tabla -->
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button 
                                        v-if="authStore.hasPermission('roles:update')"
                                        @click="openModal(role)"
                                        class="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                        :title="role.name === 'SUPER_ADMIN' ? 'Ver detalles del rol' : 'Editar rol'"
                                    >
                                        <PencilIcon class="w-4 h-4" />
                                    </button>
                                    
                                    <button 
                                        v-if="authStore.hasPermission('roles:delete') && role.name !== 'SUPER_ADMIN'"
                                        @click="confirmDelete(role)"
                                        class="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg transition-colors"
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
                class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4"
            >
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                    
                    <!-- Header -->
                    <div class="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                        <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ targetRole ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h2>
                        <button type="button" @click="isModalOpen = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">✕</button>
                    </div>

                    <!-- Formulario con scroll vertical -->
                    <form @submit.prevent="saveRole" class="flex flex-col flex-1 overflow-hidden min-h-0">
                        
                        <div class="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Nombre del Rol</label>
                                <input 
                                    v-model="form.name" 
                                    type="text" 
                                    required 
                                    :disabled="targetRole?.name === 'SUPER_ADMIN'"
                                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                                    placeholder="Ej: EDITOR"
                                />
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Descripción</label>
                                <input 
                                    v-model="form.description" 
                                    type="text" 
                                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Descripción breve de responsabilidades"
                                />
                            </div>

                            <!-- Asignación de Permisos Agrupados -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-3">Permisos Asignados</label>
                                
                                <div v-if="form.name === 'SUPER_ADMIN'" class="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-xl text-purple-700 dark:text-purple-300 text-xs">
                                    El rol SUPER_ADMIN cuenta con acceso absoluto e irrestricto a todas las funcionalidades del sistema.
                                </div>
                                
                                <div v-else class="space-y-4">
                                    <div v-for="(perms, moduleName) in groupedPermissions" :key="moduleName" class="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                        <h4 class="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-3">{{ moduleName }}</h4>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <label v-for="perm in perms" :key="perm.id" class="flex items-center space-x-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    :value="perm.action" 
                                                    v-model="form.permissions"
                                                    class="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-purple-600 focus:ring-purple-500"
                                                />
                                                <span class="break-all font-medium">{{ perm.action }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer con Botones -->
                        <div class="flex justify-end space-x-3 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 shrink-0">
                            <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                {{ targetRole?.name === 'SUPER_ADMIN' ? 'Cerrar' : 'Cancelar' }}
                            </button>
                            
                            <button 
                                v-if="targetRole?.name !== 'SUPER_ADMIN'"
                                type="submit" 
                                :disabled="saving" 
                                class="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20"
                            >
                                {{ saving ? 'Guardando...' : 'Guardar Rol' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>