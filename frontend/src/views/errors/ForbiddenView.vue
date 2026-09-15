<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <!-- Ícono decorativo o código HTTP -->
        <h1 class="text-8xl font-black text-rose-500 mb-2">403</h1>
        <h2 class="text-2xl font-bold mb-4">Acceso Restringido</h2>
        <p class="text-slate-400 mb-6 max-w-md">
            No tienes los permisos necesarios para acceder a esta página. Si crees que se trata de un error, por favor contacta con el administrador del sistema.
        </p>
        
        <div class="flex gap-4">
            <router-link
                to="/dashboard"
                class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 font-medium transition-colors"
            >
                Ir al Dashboard
            </router-link>
            
            <router-link
                to="/"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors"
            >
                Ir al Inicio
            </router-link>
        </div>
    </div>
</template>