<!-- src/views/admin/RolesAdminView.vue -->
<script setup>
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { ref, onMounted, h } from 'vue';
import { roleService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';
import { getSwalTheme } from '@/utils/swal';
import PageLayout from '@/components/common/PageLayout.vue';
import AdminTableLayout from '@/components/common/AdminTableLayout.vue';
import RoleFormModal from '@/components/admin/RoleFormModal.vue';

const authStore = useAuthStore();

const roles = ref([]);
const availablePermissions = ref([]);
const isModalOpen = ref(false);
const targetRole = ref(null);

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
    isModalOpen.value = true;
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

const columns = [
    {
        accessorKey: 'name',
        header: 'Nombre del Rol',
        cell: ({ row }) => {
            const role = row.original;
            return h('span', { class: `px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadgeClass(role.name)}` }, role.name);
        }
    },
    {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => h('span', { class: 'text-slate-600 dark:text-slate-400 max-w-xs truncate block' }, row.original.description || 'Sin descripción')
    },
    {
        accessorKey: 'userCount',
        header: 'Usuarios',
        cell: ({ row }) => h('span', { class: 'text-slate-700 dark:text-slate-300' }, `${row.original.userCount} usuario(s)`)
    },
    {
        accessorKey: 'permissions',
        header: 'Permisos Asignados',
        cell: ({ row }) => {
            const role = row.original;
            if (role.name === 'SUPER_ADMIN') {
                return h('span', { class: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/20' }, 'Acceso Total (Global)');
            }
            return h('span', { class: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600/50' }, `${role.permissions ? role.permissions.length : 0} permiso(s)`);
        }
    },
    {
        id: 'actions',
        header: () => h('div', { class: 'text-right w-full' }, 'Acciones'),
        cell: ({ row }) => {
            const role = row.original;
            const buttons = [];

            if (authStore.hasPermission('roles:update')) {
                buttons.push(h('button', {
                    onClick: () => openModal(role),
                    title: role.name === 'SUPER_ADMIN' ? 'Ver detalles del rol' : 'Editar rol',
                    class: 'p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer'
                }, [h(PencilIcon, { class: 'w-4 h-4' })]));
            }

            if (authStore.hasPermission('roles:delete') && role.name !== 'SUPER_ADMIN') {
                buttons.push(h('button', {
                    onClick: () => confirmDelete(role),
                    title: 'Eliminar rol',
                    class: 'p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg transition-colors cursor-pointer'
                }, [h(TrashIcon, { class: 'w-4 h-4' })]));
            }

            return h('div', { class: 'flex items-center justify-end gap-2 w-full' }, buttons);
        }
    }
];

onMounted(() => {
    loadData();
});
</script>

<template>
    <PageLayout 
        title="Gestión de Roles" 
        description="Administra los roles del sistema y configura las acciones permitidas para cada uno."
        :backTo="'/admin'"
        backText="Volver al Panel Admin"
    >
        <template #actions>
            <button 
                v-if="authStore.hasPermission('roles:create')"
                @click="openModal()"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-600/30 shrink-0 cursor-pointer"
            >
                <PlusIcon class="w-5 h-5" />
                <span>Nuevo Rol</span>
            </button>
        </template>

        <AdminTableLayout 
            :data="roles" 
            :columns="columns" 
        />

        <template #modales>
            <RoleFormModal 
                v-model="isModalOpen"
                :target-role="targetRole"
                :available-permissions="availablePermissions"
                @saved="loadData"
            />
        </template>
    </PageLayout>
</template>