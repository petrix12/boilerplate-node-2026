<!-- src/views/ProfileView.vue -->
<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { userService } from '@/services';
import { UserIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { getSwalTheme } from '@/utils/swal';
import PageLayout from '@/components/common/PageLayout.vue';

const authStore = useAuthStore();
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showNewPasswordConfirmation = ref(false); // Estado para el ojito de confirmación
const fileInputRef = ref(null);
const saving = ref(false);

// Estado para controlar el efecto visual cuando arrastras sobre la zona
const isDragging = ref(false);

// Formulario reactivo
const profileForm = ref({
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    currentPassword: '',
    newPassword: '',
    newPassword_confirmation: '', // Campo añadido para confirmar la nueva contraseña
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
            getSwalTheme().fire({
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
        getSwalTheme().fire({
            title: 'Sin cambios',
            text: 'No has realizado ninguna modificación en tu perfil.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    // Validación de contraseña si intenta cambiarla
    if (passwordProvided) {
        if (!profileForm.value.currentPassword) {
            getSwalTheme().fire({
                title: 'Campo requerido',
                text: 'Debes ingresar tu contraseña actual para establecer una nueva.',
                icon: 'warning'
            });
            return;
        }

        if (profileForm.value.newPassword !== profileForm.value.newPassword_confirmation) {
            getSwalTheme().fire({
                title: 'Atención',
                text: 'La nueva contraseña y su confirmación no coinciden.',
                icon: 'error'
            });
            return;
        }
    }

    saving.value = true;

    try {
        let updatedUserData = null;

        // 1. Subir Avatar vía userService
        if (profileForm.value.avatarFile) {
            const formData = new FormData();
            formData.append('avatar', profileForm.value.avatarFile);

            const avatarRes = await userService.uploadAvatar(formData);
            updatedUserData = avatarRes.data?.user || avatarRes.user;
        }

        // 2. Actualizar Datos de Perfil (Nombre y/o Contraseña) vía userService
        if (nameChanged || passwordProvided) {
            const profilePayload = {
                name: profileForm.value.name,
                ...(passwordProvided && {
                    currentPassword: profileForm.value.currentPassword,
                    newPassword: profileForm.value.newPassword
                })
            };

            const profileRes = await userService.updateProfile(profilePayload);
            updatedUserData = profileRes.data?.user || profileRes.user;
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
        profileForm.value.newPassword_confirmation = '';
        profileForm.value.avatarFile = null;
        if (fileInputRef.value) fileInputRef.value.value = '';

        getSwalTheme().fire({
            title: '¡Perfil actualizado!',
            text: 'Tus datos se han guardado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        getSwalTheme().fire({
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
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const confirmResult = await getSwalTheme().fire({
        title: '¿Eliminar foto de perfil?',
        text: 'Tu avatar se borrará permanentemente de tu cuenta.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: isDarkTheme ? 'rounded-2xl border border-slate-700 shadow-2xl' : 'rounded-2xl border border-slate-200 shadow-2xl',
            confirmButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-red-600 hover:bg-red-500 text-white transition-colors mr-3',
            cancelButton: isDarkTheme 
                ? 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                : 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors'
        }
    });

    if (!confirmResult.isConfirmed) return;

    saving.value = true;

    try {
        const response = await userService.deleteAvatar();
        const updatedUser = response.data?.user || response.user;

        if (typeof authStore.setUser === 'function') {
            authStore.setUser(updatedUser);
        } else {
            authStore.user = { ...authStore.user, avatarUrl: null };
        }

        profileForm.value.avatarUrl = null;
        profileForm.value.avatarFile = null;
        if (fileInputRef.value) fileInputRef.value.value = '';

        getSwalTheme().fire({
            title: 'Eliminada',
            text: 'Tu foto de perfil ha sido eliminada.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error al eliminar avatar:', error);
        getSwalTheme().fire({
            title: 'Error',
            text: error.response?.data?.message || 'Error al eliminar la imagen de perfil.',
            icon: 'error'
        });
    } finally {
        saving.value = false;
    }
};

// Función para manejar el evento Drop
const handleDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        const file = files[0];
        
        // 1. Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            getSwalTheme().fire({
                title: 'Archivo inválido',
                text: 'Por favor, arrastra un archivo de imagen válido.',
                icon: 'warning'
            });
            return;
        }

        // 2. Validar tamaño máximo (2MB)
        if (file.size > 2 * 1024 * 1024) {
            getSwalTheme().fire({
                title: 'Archivo muy grande',
                text: 'La imagen supera el tamaño máximo permitido de 2MB.',
                icon: 'warning'
            });
            return;
        }

        // Liberar ObjectURL anterior si existía para evitar leaks de memoria
        if (profileForm.value.avatarUrl && profileForm.value.avatarUrl.startsWith('blob:')) {
            URL.revokeObjectURL(profileForm.value.avatarUrl);
        }

        // Asignamos el archivo correctamente
        profileForm.value.avatarFile = file;
        profileForm.value.avatarUrl = URL.createObjectURL(file);
    }
};
</script>

<template>
    <PageLayout 
        title="Mi Perfil" 
        description="Administra tu información personal y seguridad de la cuenta."
        :backTo="'/dashboard'"
        backText="Volver al Dashboard"
        :isAdmin="false"
    >
        <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- Sección Avatar & Datos Básicos con Drag & Drop -->
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <UserIcon class="w-5 h-5 text-emerald-400" />
                    Información Personal
                </h3>

                <!-- Contenedor principal con eventos de Drag & Drop -->
                <div 
                    class="flex flex-col sm:flex-row items-center gap-6 mb-6 p-4 rounded-xl border-2 border-dashed transition-all duration-200"
                    :class="isDragging ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]' : 'border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/30'"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                >
                    <!-- Avatar Preview -->
                    <div class="relative w-24 h-24 rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0 shadow-inner">
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

                    <!-- Botones y Mensaje de guía -->
                    <div class="flex flex-col space-y-2 text-center sm:text-left w-full">
                        <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                            <label class="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition-colors shadow-md">
                                <span>Cambiar Foto</span>
                                <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                            </label>

                            <button 
                                v-if="profileForm.avatarFile" 
                                type="button" 
                                @click="removeAvatarSelection" 
                                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-300 rounded-xl transition-colors"
                            >
                                Cancelar Selección
                            </button>

                            <button 
                                v-else-if="authStore.user?.avatarUrl" 
                                type="button" 
                                @click="removeCurrentAvatar" 
                                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-red-400 rounded-xl transition-colors"
                            >
                                Quitar Foto
                            </button>
                        </div>
                        <p class="text-xs text-slate-400 pt-1">
                            <span class="text-emerald-400 font-medium">Arrastra una imagen aquí</span> o usa el botón. JPG, PNG / Máx. 2MB.
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nombre Completo</label>
                        <input 
                            v-model="profileForm.name" 
                            type="text" 
                            required 
                            class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                        <input 
                            v-model="profileForm.email" 
                            type="email" 
                            disabled 
                            class="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                        />
                    </div>
                </div>
            </div>

            <!-- Sección Seguridad -->
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <KeyIcon class="w-5 h-5 text-emerald-400" />
                    Cambiar Contraseña
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- Contraseña Actual -->
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Contraseña Actual</label>
                        <div class="relative">
                            <input 
                                v-model="profileForm.currentPassword" 
                                :type="showCurrentPassword ? 'text' : 'password'" 
                                placeholder="••••••••" 
                                class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                            />
                            <button 
                                type="button"
                                @click="showCurrentPassword = !showCurrentPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                            >
                                <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Nueva Contraseña -->
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Nueva Contraseña</label>
                        <div class="relative">
                            <input 
                                v-model="profileForm.newPassword" 
                                :type="showNewPassword ? 'text' : 'password'" 
                                placeholder="••••••••" 
                                class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                            />
                            <button 
                                type="button"
                                @click="showNewPassword = !showNewPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                            >
                                <EyeIcon v-if="!showNewPassword" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Confirmar Nueva Contraseña -->
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Confirmar Nueva Contraseña</label>
                        <div class="relative">
                            <input 
                                v-model="profileForm.newPassword_confirmation" 
                                :type="showNewPasswordConfirmation ? 'text' : 'password'" 
                                placeholder="••••••••" 
                                class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                            />
                            <button 
                                type="button"
                                @click="showNewPasswordConfirmation = !showNewPasswordConfirmation"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                            >
                                <EyeIcon v-if="!showNewPasswordConfirmation" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button 
                    type="submit" 
                    :disabled="saving" 
                    class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                >
                    <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
                </button>
            </div>
        </form>
    </PageLayout>
</template>