<!-- src/views/legal/CookiesView.vue -->
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <button @click="router.back()" class="mb-6 text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                ← Volver
            </button>
            <h1 class="text-3xl font-bold mb-4">Política de Cookies</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Última actualización: Octubre de 2026</p>
            
            <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>En <strong>NodeVue Boilerplate</strong> utilizamos almacenamiento local y cookies técnicas para garantizar el correcto funcionamiento de la plataforma y la persistencia de tu sesión.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">1. ¿Qué son las cookies y el almacenamiento local?</h2>
                <p>Son pequeños archivos de texto que se almacenan en tu navegador web. Utilizamos principalmente <code>localStorage</code> para guardar tu token de autenticación cifrado y las preferencias de interfaz (como el modo oscuro).</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">2. Tipos de tecnologías utilizadas</h2>
                <ul class="list-disc pl-5 space-y-1 mt-2">
                    <li><strong>Cookies técnicas / de sesión:</strong> Indispensables para mantener tu sesión iniciada de forma segura mientras navegas por el panel de administración o el dashboard.</li>
                    <li><strong>Preferencias de usuario:</strong> Almacenan ajustes visuales (como el tema oscuro o claro) elegidos por ti.</li>
                </ul>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">3. Cómo gestionar o deshabilitar las cookies</h2>
                <p>Puedes configurar tu navegador para bloquear o eliminar las cookies y los datos de almacenamiento local en cualquier momento. Ten en cuenta que si deshabilitas las cookies técnicas o de sesión, es posible que no puedas iniciar sesión ni utilizar las funciones protegidas de la aplicación.</p>
            </div>
        </div>
    </div>
</template>