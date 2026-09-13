<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <h1 class="text-8xl font-black text-emerald-500 mb-2">404</h1>
        <h2 class="text-2xl font-bold mb-4">Página no encontrada</h2>
        <p class="text-slate-400 mb-6 max-w-md">
            La ruta a la que intentas acceder no existe o ha sido movida a otro lugar.
        </p>
        <router-link
            to="/"
            class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-emerald-400 font-medium transition-colors"
        >
            Volver al Inicio
        </router-link>
    </div>
</template>