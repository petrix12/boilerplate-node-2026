<!-- src/components/admin/UserRoleModal.vue -->
<script setup>
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { userService } from '@/services';
import { getSwalTheme } from '@/utils/swal';

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    user: { type: Object, default: null },
    availableRoles: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const saving = ref(false);
const modalRoles = ref([]);

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

watch(() => props.user, (newUser) => {
    if (newUser) {
        modalRoles.value = [...(newUser.roles || [])];
    }
});

const saveUserRoles = async () => {
    if (!props.user) return;
    saving.value = true;
    try {
        await userService.updateUserRoles(props.user.id, modalRoles.value);
        props.user.roles = [...modalRoles.value];
        isOpen.value = false;

        getSwalTheme().fire({
            title: '¡Roles actualizados!',
            text: 'Los permisos del usuario se han modificado correctamente.',
            icon: 'success',
            timer: 2200,
            showConfirmButton: false
        });
        emit('saved');
    } catch (err) {
        getSwalTheme().fire({
            title: 'Error',
            text: err.response?.data?.message || 'Error al guardar los roles del usuario.',
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
        title="Gestionar Roles"
        max-width="max-w-md"
        @close="$emit('update:modelValue', false)"
    >
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4" v-if="user">
            Modificando permisos para <span class="text-emerald-400 font-semibold">{{ user.name }}</span>
        </p>

        <div class="space-y-3">
            <label v-for="role in availableRoles" :key="role" class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                <input
                    type="checkbox"
                    :value="role"
                    v-model="modalRoles"
                    class="w-4 h-4 text-emerald-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <span class="text-sm font-medium text-slate-900 dark:text-slate-200">{{ role }}</span>
            </label>
        </div>

        <template #footer>
            <button
                @click="isOpen = false"
                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition-colors text-sm cursor-pointer"
            >
                Cancelar
            </button>
            <button
                @click="saveUserRoles"
                :disabled="saving"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors text-sm cursor-pointer"
            >
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
        </template>
    </BaseModal>
</template>