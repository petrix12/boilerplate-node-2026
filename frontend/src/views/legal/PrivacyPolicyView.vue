<!-- src/views/legal/PrivacyPolicyView.vue -->
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
            <h1 class="text-3xl font-bold mb-4">Política de Privacidad</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Última actualización: Octubre de 2026</p>
            
            <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>En <strong>NodeVue Boilerplate</strong>, valoramos tu privacidad. Esta política describe qué datos recopilamos y cómo los utilizamos.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">1. Información que recopilamos</h2>
                <p>Cuando inicias sesión a través de proveedores externos (como Google o Facebook), recopilamos únicamente los datos básicos proporcionados por tu perfil autorizado (nombre, correo electrónico y foto de perfil) necesarios para autenticar tu cuenta.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">2. Uso de la información</h2>
                <p>La información recopilada se utiliza exclusivamente para gestionar el acceso a tu cuenta de usuario dentro de la plataforma y garantizar la seguridad de la sesión.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">3. Modificaciones</h2>
                <p>Este texto es una plantilla base para desarrolladores. Puedes modificar esta sección libremente para adaptarla a los requerimientos legales específicos de tu aplicación final en producción.</p>
            </div>
        </div>
    </div>
</template>