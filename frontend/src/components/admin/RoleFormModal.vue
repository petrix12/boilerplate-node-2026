<!-- src/components/admin/RoleFormModal.vue -->
<script setup>
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { roleService } from '@/services';
import { getSwalTheme } from '@/utils/swal';

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    targetRole: { type: Object, default: null },
    availablePermissions: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const saving = ref(false);
const form = ref({
    name: '',
    description: '',
    permissions: []
});

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

// Agrupar permisos por módulo
const groupedPermissions = computed(() => {
    return props.availablePermissions.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {});
});

watch(() => props.targetRole, (role) => {
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
});

const saveRole = async () => {
    saving.value = true;
    try {
        if (props.targetRole) {
            await roleService.updateRole(props.targetRole.id, form.value);
        } else {
            await roleService.createRole(form.value);
        }
        isOpen.value = false;
        
        getSwalTheme().fire({
            title: '¡Guardado!',
            text: 'El rol ha sido guardado exitosamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        emit('saved');
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
</script>

<template>
    <BaseModal
        v-model="isOpen"
        :title="targetRole ? 'Editar Rol' : 'Crear Nuevo Rol'"
        max-width="max-w-2xl"
    >
        <form id="role-form" @submit.prevent="saveRole" class="space-y-5">
            <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Nombre del Rol</label>
                <input 
                    v-model="form.name" 
                    type="text" 
                    required 
                    :disabled="targetRole?.name === 'SUPER_ADMIN'"
                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 text-sm"
                    placeholder="Ej: EDITOR"
                />
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Descripción</label>
                <input 
                    v-model="form.description" 
                    type="text" 
                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 text-sm"
                    placeholder="Descripción breve de responsabilidades"
                />
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-3">Permisos Asignados</label>
                
                <div v-if="targetRole?.name === 'SUPER_ADMIN'" class="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-xl text-purple-700 dark:text-purple-300 text-xs">
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
                                    class="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                />
                                <span class="break-all font-medium">{{ perm.action }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <template #footer>
            <button 
                type="button" 
                @click="isOpen = false" 
                class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
                {{ targetRole?.name === 'SUPER_ADMIN' ? 'Cerrar' : 'Cancelar' }}
            </button>
            
            <button 
                v-if="targetRole?.name !== 'SUPER_ADMIN'"
                form="role-form"
                type="submit" 
                :disabled="saving" 
                class="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
            >
                {{ saving ? 'Guardando...' : 'Guardar Rol' }}
            </button>
        </template>
    </BaseModal>
</template>