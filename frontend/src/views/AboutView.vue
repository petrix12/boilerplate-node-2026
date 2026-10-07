<!-- src/views/AboutView.vue -->
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const appName = import.meta.env.VITE_APP_NAME || 'NodeVue Boilerplate';
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <button @click="router.back()" class="mb-6 text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                ← Volver
            </button>
            <h1 class="text-3xl font-bold mb-4">Acerca de Nosotros</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Conoce más sobre {{ appName }}</p>
            
            <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p><strong>{{ appName }}</strong> nace como una solución moderna, robusta y modular orientada a desarrolladores que buscan acelerar el despliegue de aplicaciones web seguras y listas para producción.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">Nuestra Misión</h2>
                <p>Simplificar la arquitectura full-stack integrando las mejores prácticas de desarrollo: autenticación robusta mediante múltiples proveedores sociales (Google, Facebook, LinkedIn, Instagram), control de roles y permisos granulares, auditoría de seguridad y una interfaz limpia basada en Vue 3 y Tailwind CSS.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">¿Por qué elegir esta arquitectura?</h2>
                <p>Porque priorizamos la modularidad, la mantenibilidad del código y la seguridad desde la primera línea, permitiéndote concentrarte en la lógica de negocio única de tu producto.</p>
            </div>
        </div>
    </div>
</template>