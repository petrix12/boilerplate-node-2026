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
            <h1 class="text-3xl font-bold mb-4">Instrucciones para la Eliminación de Datos</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Última actualización: Octubre de 2026</p>
            
            <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>De acuerdo con las políticas de las plataformas de autenticación social (como Facebook, Instagram y Google), los usuarios tienen derecho a solicitar la eliminación de sus datos personales almacenados en nuestra aplicación.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">1. Cómo solicitar la eliminación de tus datos</h2>
                <p>Si iniciaste sesión mediante una red social o creaste una cuenta y deseas eliminar por completo tu perfil y los registros asociados de nuestra base de datos, puedes hacerlo siguiendo estos pasos:</p>
                <ol class="list-decimal pl-5 space-y-2 mt-2">
                    <li>Inicia sesión en tu cuenta dentro de la plataforma.</li>
                    <li>Dirígete a la sección de <strong>Perfil de Usuario</strong> en el menú de navegación.</li>
                    <li>Haz clic en el botón de eliminar cuenta o comunícate directamente con nuestro equipo de soporte técnico.</li>
                </ol>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">2. Eliminación desde la configuración de Meta (Facebook / Instagram)</h2>
                <p>Si utilizaste el inicio de sesión con Facebook o Instagram, también puedes revocar el acceso de nuestra aplicación desde la configuración de tu cuenta social:</p>
                <ul class="list-disc pl-5 space-y-1 mt-2">
                    <li>Ve a la Configuración de tu cuenta de Facebook o Instagram.</li>
                    <li>Busca la sección <strong>Aplicaciones y sitios web</strong> o <strong>Apps empresariales</strong>.</li>
                    <li>Selecciona nuestra aplicación y haz clic en <strong>Eliminar</strong> o <strong>Revocar acceso</strong>. Esto notificará a nuestro sistema la desconexión de tus datos.</li>
                </ul>

                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">3. Soporte y Consultas</h2>
                <p>Para cualquier duda adicional sobre la retención o privacidad de tus datos, puedes contactarnos a través de nuestra sección de soporte.</p>
            </div>
        </div>
    </div>
</template>