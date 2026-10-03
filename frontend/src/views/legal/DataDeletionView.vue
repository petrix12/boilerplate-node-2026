<!-- src/views/legal/DataDeletionView.vue -->
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
            <h1 class="text-3xl font-bold mb-4">Instrucciones para la Eliminación de Datos de Usuario</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Conforme a las políticas de Meta y Facebook</p>
            
            <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>De acuerdo con la normativa de privacidad de Facebook, los usuarios tienen derecho a solicitar la eliminación de sus datos vinculados a nuestra aplicación.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">¿Cómo eliminar tus datos?</h2>
                <ol class="list-decimal list-inside space-y-2">
                    <li>Inicia sesión en tu cuenta dentro de <strong>NodeVue Boilerplate</strong>.</li>
                    <li>Dirígete a la sección de <strong>Configuración de Perfil</strong>.</li>
                    <li>Haz clic en el botón de <strong>Eliminar Cuenta / Borrar Datos</strong>. Esto purgará automáticamente tu información de nuestras bases de datos locales.</li>
                </ol>

                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">Eliminación mediante Facebook</h2>
                <p>Si iniciaste sesión usando Facebook, puedes eliminar la actividad de nuestra app directamente desde la configuración de tu cuenta de Facebook:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Ve a la <strong>Configuración y privacidad</strong> de tu cuenta de Facebook.</li>
                    <li>Entra en <strong>Aplicaciones y sitios web</strong>.</li>
                    <li>Busca nuestra aplicación y haz clic en <strong>Eliminar</strong> para revocar el acceso y solicitar la eliminación de los datos asociados.</li>
                </ul>
            </div>
        </div>
    </div>
</template>