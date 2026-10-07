<!-- src/views/legal/ContactView.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getSwalTheme } from '@/utils/swal';
import { contactService } from '@/services';

const router = useRouter();
const loading = ref(false);
const form = ref({
    name: '',
    email: '',
    message: ''
});

const handleSubmit = async () => {
    loading.value = true;
    try {
        const data = await contactService.sendMessage(form.value);
        getSwalTheme().fire({
            icon: 'success',
            title: '¡Mensaje enviado!',
            text: data.message || 'Gracias por ponerte en contacto. Te responderemos a la brevedad.',
        });
        form.value = { name: '', email: '', message: '' };
    } catch (err) {
        getSwalTheme().fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data?.message || 'Hubo un error al enviar el mensaje.',
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <!-- Tu plantilla HTML se mantiene exactamente igual -->
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <button @click="router.back()" class="mb-6 text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                ← Volver
            </button>
            <h1 class="text-3xl font-bold mb-2">Contacto y Soporte</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">¿Tienes alguna pregunta o sugerencia? Escríbenos.</p>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Nombre</label>
                    <input 
                        v-model="form.name"
                        type="text" 
                        required
                        class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                        placeholder="Tu nombre"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                    <input 
                        v-model="form.email"
                        type="email" 
                        required
                        class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                        placeholder="tu@correo.com"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Mensaje</label>
                    <textarea 
                        v-model="form.message"
                        rows="4" 
                        required
                        class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-200"
                        placeholder="¿Cómo podemos ayudarte?"
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {{ loading ? 'Enviando...' : 'Enviar Mensaje' }}
                </button>
            </form>
        </div>
    </div>
</template>