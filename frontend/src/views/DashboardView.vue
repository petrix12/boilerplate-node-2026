<script setup>
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '../stores/auth.store';

    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await authStore.logout();
        router.push({ name: 'login' });
    };
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <!-- Main Content -->
        <main class="flex-1 p-6 max-w-4xl mx-auto w-full">
            <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
                <h2 class="text-lg font-semibold text-emerald-400 mb-4">Perfil de Usuario Autenticado</h2>
                
                <div class="space-y-3 text-slate-300">
                    <p><strong class="text-slate-100">ID:</strong> {{ authStore.user?.id }}</p>
                    <p><strong class="text-slate-100">Nombre:</strong> {{ authStore.user?.name }}</p>
                    <p><strong class="text-slate-100">Correo:</strong> {{ authStore.user?.email }}</p>
                    <p>
                        <strong class="text-slate-100">Roles:</strong>
                            <span
                                v-for="role in authStore.userRoles"
                                :key="role"
                                class="ml-2 inline-block px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded"
                            >
                                {{ role }}
                        </span>
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>