<!-- src/views/admin/UsersAdminView.vue -->
<script setup>
import { h, ref, onMounted } from 'vue';
import { TrashIcon, UserGroupIcon, PencilSquareIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { userService, roleService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';
import { getSwalTheme } from '@/utils/swal';
import PageLayout from '@/components/common/PageLayout.vue';
import AdminTableLayout from '@/components/common/AdminTableLayout.vue';
import UserRoleModal from '@/components/admin/UserRoleModal.vue';
import UserFormModal from '@/components/admin/UserFormModal.vue';

const authStore = useAuthStore();

// --- ESTADOS GENERALES Y TABLA ---
const users = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const pagination = ref({ page: 1, totalPages: 1, total: 0 });
let searchTimeout = null;

// --- ESTADOS PARA MODALES ---
const selectedUser = ref(null);
const availableRoles = ref([]);
const isRoleModalOpen = ref(false);

const isUserModalOpen = ref(false);
const targetUser = ref(null);

// --- ORDENAMIENTO Y CARGA ---
const sortBy = ref('createdAt');
const sortOrder = ref('desc');

const handleSort = (field) => {
    if (sortBy.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy.value = field;
        sortOrder.value = 'asc';
    }
    fetchUsers(1);
};

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

// --- APERTURA DE MODALES ---
const openRoleModal = (user) => {
    selectedUser.value = user;
    isRoleModalOpen.value = true;
};

const openUserModal = (user = null) => {
    targetUser.value = user;
    isUserModalOpen.value = true;
};

// --- ELIMINACIÓN ---
const confirmDeleteUser = async (user) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await getSwalTheme().fire({
        title: '¿Eliminar usuario?',
        html: `Estás a punto de eliminar a <strong>${user.name}</strong>.<br><span class="text-xs text-slate-400">Esta acción no se puede deshacer.</span>`,
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
            await userService.deleteUser(user.id);
            getSwalTheme().fire({
                title: '¡Eliminado!',
                text: 'El usuario ha sido eliminado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            await fetchUsers(pagination.value.page);
        } catch (err) {
            getSwalTheme().fire({
                title: 'Error',
                text: err.response?.data?.message || 'Error al intentar eliminar el usuario',
                icon: 'error'
            });
        }
    }
};

// --- UTILITIES Y COLUMNAS ---
const getRoleBadgeClass = (role) => {
    switch (role) {
        case 'SUPER_ADMIN': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
        case 'ADMIN': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
        case 'USER': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30';
        default: return 'bg-amber-100 dark:bg-yellow-900/40 text-amber-800 dark:text-yellow-300 border-amber-300 dark:border-yellow-500/30';
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fetchAvailableRoles = async () => {
    try {
        const res = await roleService.getRoles();
        const rolesData = res.data.roles || res.data;
        availableRoles.value = rolesData.map((r) => (typeof r === 'object' ? r.name : r));
    } catch (err) {
        console.error('Error al cargar roles disponibles:', err);
    }
};

const columns = [
    {
        accessorKey: 'name',
        header: () => h('div', { 
            class: 'cursor-pointer hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 select-none',
            onClick: () => handleSort('name') 
        }, [
            h('span', {}, 'Usuario'),
            h('span', { class: 'inline-flex flex-col text-[10px] leading-none ml-1' }, [
                h('span', { class: sortBy.value === 'name' && sortOrder.value === 'asc' ? 'text-emerald-500 font-bold' : 'text-slate-400' }, '▲'),
                h('span', { class: sortBy.value === 'name' && sortOrder.value === 'desc' ? 'text-emerald-500 font-bold' : 'text-slate-400' }, '▼')
            ])
        ]),
        cell: ({ row }) => {
            const user = row.original;
            return h('div', { class: 'flex items-center' }, [
                h('div', { class: 'w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 uppercase border border-slate-300 dark:border-slate-600 overflow-hidden shrink-0' }, [
                    user.avatarUrl || user.avatar 
                        ? h('img', { src: user.avatarUrl || user.avatar, alt: user.name, class: 'w-full h-full object-cover' })
                        : h('span', {}, user.name ? user.name.charAt(0) : 'U')
                ]),
                h('div', { class: 'ml-4' }, [
                    h('div', { class: 'font-medium text-slate-900 dark:text-slate-200' }, user.name),
                    h('div', { class: 'text-xs text-slate-500 dark:text-slate-400' }, user.email)
                ])
            ]);
        }
    },
    {
        accessorKey: 'roles',
        header: 'Roles Asignados',
        cell: ({ row }) => {
            const user = row.original;
            if (!user.roles || user.roles.length === 0) {
                return h('span', { class: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600' }, 'Sin permisos (Guest)');
            }
            return h('div', { class: 'flex flex-wrap gap-1.5' }, user.roles.map(role => 
                h('span', { class: `px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeClass(role)}` }, role)
            ));
        }
    },
    {
        accessorKey: 'createdAt',
        header: () => h('div', { 
            class: 'cursor-pointer hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 select-none',
            onClick: () => handleSort('createdAt') 
        }, [
            h('span', {}, 'Fecha Registro'),
            h('span', { class: 'inline-flex flex-col text-[10px] leading-none ml-1' }, [
                h('span', { class: sortBy.value === 'createdAt' && sortOrder.value === 'asc' ? 'text-emerald-500 font-bold' : 'text-slate-400' }, '▲'),
                h('span', { class: sortBy.value === 'createdAt' && sortOrder.value === 'desc' ? 'text-emerald-500 font-bold' : 'text-slate-400' }, '▼')
            ])
        ]),
        cell: ({ row }) => h('span', { class: 'text-slate-600 dark:text-slate-400' }, formatDate(row.original.createdAt))
    },
    {
        id: 'actions',
        header: () => h('div', { class: 'text-right w-full' }, 'Acciones'),
        cell: ({ row }) => {
            const user = row.original;
            const buttons = [];

            if (authStore.hasPermission('users:update')) {
                buttons.push(h('button', {
                    onClick: () => openUserModal(user),
                    title: 'Editar datos del usuario',
                    class: 'h-9 w-9 inline-flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all cursor-pointer'
                }, [h(PencilSquareIcon, { class: 'w-4 h-4' })]));
            }

            if (authStore.hasPermission('users:delete')) {
                buttons.push(h('button', {
                    onClick: () => confirmDeleteUser(user),
                    title: 'Eliminar usuario',
                    class: 'h-9 w-9 inline-flex items-center justify-center bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer'
                }, [h(TrashIcon, { class: 'w-4 h-4' })]));
            }

            if (authStore.hasPermission('roles:update')) {
                buttons.push(h('button', {
                    onClick: () => openRoleModal(user),
                    title: 'Editar Roles',
                    class: 'h-9 px-3 inline-flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-lg transition-all cursor-pointer'
                }, [h(UserGroupIcon, { class: 'w-4 h-4' })]));
            }

            return h('div', { class: 'flex items-center justify-end space-x-2 w-full' }, buttons);
        }
    }
];

onMounted(() => {
    fetchUsers();
    fetchAvailableRoles();
});
</script>

<template>
    <PageLayout 
        title="Gestión de Usuarios" 
        description="Administra los permisos y accesos de la plataforma en tiempo real."
        :backTo="'/admin'"
        backText="Volver al Panel Admin"
    >
        <template #actions>
            <button
                v-if="authStore.hasPermission('users:create')"
                @click="openUserModal(null)"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-600/35 shrink-0 cursor-pointer"
            >
                <PlusIcon class="w-5 h-5" />
                Nuevo Usuario
            </button>
        </template>

        <AdminTableLayout 
            :data="users" 
            :columns="columns" 
            :loading="loading"
            :page="pagination.page"
            :total-pages="pagination.totalPages"
            :total="pagination.total"
            @page-change="changePage"
        >
            <template #filters>
                <div class="relative">
                    <input
                        v-model="searchQuery"
                        @input="handleSearch"
                        type="text"
                        placeholder="Buscar por nombre o correo electrónico..."
                        class="w-full bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                    <MagnifyingGlassIcon class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                </div>
            </template>
        </AdminTableLayout>

        <template #modales>
            <UserRoleModal 
                v-model="isRoleModalOpen" 
                :user="selectedUser" 
                :available-roles="availableRoles"
                @saved="fetchUsers(pagination.page)" 
            />
            
            <UserFormModal 
                v-model="isUserModalOpen" 
                :target-user="targetUser" 
                @saved="fetchUsers(pagination.page)" 
            />
        </template>
    </PageLayout>
</template>