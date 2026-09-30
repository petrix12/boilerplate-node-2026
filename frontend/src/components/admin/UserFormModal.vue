<!-- src/components/admin/UserFormModal.vue -->
<script setup>
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { userService } from '@/services';
import { getSwalTheme } from '@/utils/swal';

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    targetUser: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const saving = ref(false);
const fileInputRef = ref(null);
const uploadingAvatar = ref(false);
const isDragging = ref(false);
const showUserPassword = ref(false);
const DEFAULT_PASSWORD = 'Password123*';

const userForm = ref({
    name: '',
    email: '',
    password: '',
    avatarUrl: null,
    avatarFile: null
});

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

watch(() => props.targetUser, (user) => {
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
    showUserPassword.value = false;
});

const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    processSelectedFile(file);
};

const removeAvatar = async () => {
    if (props.targetUser) {
        uploadingAvatar.value = true;
        try {
            await userService.deleteUserAvatarById(props.targetUser.id);
            userForm.value.avatarUrl = null;
            userForm.value.avatarFile = null;
            props.targetUser.avatarUrl = null;
            props.targetUser.avatar = null;
        } catch (err) {
            getSwalTheme().fire({
                title: 'Error',
                text: err.response?.data?.message || 'Error al eliminar la imagen',
                icon: 'error'
            });
        } finally {
            uploadingAvatar.value = false;
        }
    } else {
        userForm.value.avatarFile = null;
        userForm.value.avatarUrl = null;
    }

    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

const processSelectedFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        getSwalTheme().fire({
            title: 'Archivo inválido',
            text: 'Por favor, selecciona o arrastra un archivo de imagen válido.',
            icon: 'warning'
        });
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        getSwalTheme().fire({
            title: 'Archivo muy grande',
            text: 'La imagen supera el tamaño máximo permitido de 2MB.',
            icon: 'warning'
        });
        if (fileInputRef.value) fileInputRef.value.value = '';
        return;
    }

    if (props.targetUser) {
        uploadingAvatar.value = true;
        try {
            const formData = new FormData();
            formData.append('avatar', file, file.name);

            const res = await userService.uploadUserAvatarById(props.targetUser.id, formData);
            const updatedAvatar = res.data?.user?.avatarUrl || URL.createObjectURL(file);
            userForm.value.avatarUrl = updatedAvatar;
            props.targetUser.avatarUrl = updatedAvatar;
            props.targetUser.avatar = updatedAvatar;
        } catch (err) {
            getSwalTheme().fire({
                title: 'Error',
                text: err.response?.data?.message || 'Error al subir la imagen',
                icon: 'error'
            });
        } finally {
            uploadingAvatar.value = false;
        }
    } else {
        if (userForm.value.avatarUrl && userForm.value.avatarUrl.startsWith('blob:')) {
            URL.revokeObjectURL(userForm.value.avatarUrl);
        }
        userForm.value.avatarFile = file;
        userForm.value.avatarUrl = URL.createObjectURL(file);
    }
};

const handleDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        processSelectedFile(files[0]);
    }
};

const saveUserData = async () => {
    saving.value = true;
    try {
        if (props.targetUser) {
            const payload = { 
                name: userForm.value.name, 
                email: userForm.value.email 
            };
            if (userForm.value.password) payload.password = userForm.value.password;

            const res = await userService.updateUser(props.targetUser.id, payload);
            props.targetUser.name = res.data.user.name;
            props.targetUser.email = res.data.user.email;

            getSwalTheme().fire({
                title: '¡Actualizado!',
                text: 'Los datos del usuario han sido actualizados correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            const passwordToUse = userForm.value.password.trim() !== '' 
                ? userForm.value.password 
                : DEFAULT_PASSWORD;

            const res = await userService.createUser({
                name: userForm.value.name,
                email: userForm.value.email,
                password: passwordToUse
            });

            const newUserId = res.data.user.id;

            if (userForm.value.avatarFile && newUserId) {
                const formData = new FormData();
                formData.append('avatar', userForm.value.avatarFile);
                await userService.uploadUserAvatarById(newUserId, formData);
            }

            const usedDefault = !userForm.value.password.trim();
            const passwordInfo = usedDefault 
                ? '<br><span class="text-xs text-amber-400 mt-1 block">Contraseña asignada por defecto: <strong>Password123*</strong></span>' 
                : '';

            getSwalTheme().fire({
                title: '¡Usuario creado exitosamente!',
                html: `Se ha registrado a <strong>${userForm.value.name}</strong> en el sistema.${passwordInfo}`,
                icon: 'success',
                showConfirmButton: usedDefault,
                confirmButtonText: 'Entendido',
                timer: usedDefault ? undefined : 2500
            });
        }
        isOpen.value = false;
        emit('saved');
    } catch (err) {
        getSwalTheme().fire({
            title: 'Error',
            text: err.response?.data?.message || 'Error al procesar la solicitud',
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
        :title="targetUser ? 'Editar Usuario' : 'Nuevo Usuario'"
        max-width="max-w-md"
    >
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ targetUser ? `Modificando los datos de ${targetUser.name}` : 'Ingresa la información del nuevo usuario' }}
        </p>

        <form id="user-form" @submit.prevent="saveUserData" class="space-y-4">
            <div>
                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nombre Completo</label>
                <input
                    v-model="userForm.name"
                    type="text"
                    required
                    class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
            </div>

            <div>
                <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                <input
                    v-model="userForm.email"
                    type="email"
                    required
                    class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
            </div>

            <div>
                <div class="flex justify-between items-center mb-1">
                    <label class="block text-xs font-semibold uppercase text-slate-400">
                        Contraseña {{ targetUser ? '(Opcional / Dejar en blanco)' : '' }}
                    </label>
                    <span v-if="!targetUser" class="text-[11px] text-amber-600 dark:text-amber-400/90 font-medium">
                        Si se deja vacía: <code class="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300 font-mono">{{ DEFAULT_PASSWORD }}</code>
                    </span>
                </div>
                <div class="relative">
                    <input
                        v-model="userForm.password"
                        :type="showUserPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                    <button 
                        type="button"
                        @click="showUserPassword = !showUserPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                    >
                        <EyeIcon v-if="!showUserPassword" class="w-5 h-5" />
                        <EyeSlashIcon v-else class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div 
                class="flex items-center space-x-4 p-3 rounded-xl border-2 border-dashed transition-all duration-200"
                :class="isDragging ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]' : 'border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/30'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
            >
                <div class="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-slate-300 dark:border-slate-600 shrink-0 shadow-inner">
                    <img 
                        v-if="userForm.avatarUrl" 
                        :src="userForm.avatarUrl" 
                        :alt="userForm.name"
                        class="w-full h-full object-cover" 
                    />
                    <span v-else class="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {{ userForm.name ? userForm.name.charAt(0).toUpperCase() : 'U' }}
                    </span>
                    <div v-if="uploadingAvatar" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    </div>
                </div>

                <div class="flex flex-col space-y-1.5 w-full">
                    <div class="flex items-center gap-2">
                        <label class="cursor-pointer px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-xs text-white font-medium rounded-lg border border-slate-700 dark:border-slate-600 transition-colors inline-block text-center shadow-sm">
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
                            class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50 font-medium cursor-pointer"
                        >
                            Eliminar
                        </button>
                    </div>
                    <p class="text-[11px] text-slate-600 dark:text-slate-400">
                        <span class="text-emerald-600 dark:text-emerald-400 font-medium">Arrastra una imagen</span> o usa el botón (Máx. 2MB).
                    </p>
                </div>
            </div>
        </form>

        <template #footer>
            <button
                type="button"
                @click="isOpen = false"
                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition-colors text-sm cursor-pointer"
            >
                Cancelar
            </button>
            <button
                form="user-form"
                type="submit"
                :disabled="saving || uploadingAvatar"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors text-sm cursor-pointer"
            >
                {{ saving ? 'Guardando...' : (targetUser ? 'Guardar Cambios' : 'Crear Usuario') }}
            </button>
        </template>
    </BaseModal>
</template>