<!-- src/views/legal/TermsView.vue -->
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
            <h1 class="text-3xl font-bold mb-4">Condiciones del Servicio</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Última actualización: Octubre de 2026</p>
            
            <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>Bienvenido a <strong>NodeVue Boilerplate</strong>. Al utilizar nuestra aplicación, aceptas los siguientes términos y condiciones de uso.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">1. Uso de la Cuenta</h2>
                <p>Eres responsable de mantener la seguridad de tu cuenta y de todas las actividades que ocurran bajo ella. Nos reservamos el derecho de suspender cuentas que incumplan las normas de seguridad.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">2. Propiedad Intelectual</h2>
                <p>La estructura del software, código base y diseños predeterminados pertenecen al ecosistema del boilerplate. Eres libre de adaptarlo para tus proyectos comerciales o personales.</p>
                
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">3. Modificaciones del Servicio</h2>
                <p>Esta sección es totalmente personalizable para el desarrollador. Modifica estos términos según las reglas comerciales de tu producto final.</p>
            </div>
        </div>
    </div>
</template>