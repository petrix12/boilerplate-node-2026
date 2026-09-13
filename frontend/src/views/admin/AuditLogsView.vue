<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <div class="p-6 max-w-7xl mx-auto space-y-6">
            <!-- Botón de retorno al Panel Admin -->
            <div class="mb-6">
                <router-link 
                    to="/admin" 
                    class="inline-flex items-center space-x-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors group"
                >
                    <ChevronLeftIcon class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al Panel Admin</span>
                </router-link>
            </div>
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Historial detallado de actividad y acciones ejecutadas.</p>
                </div>
                <button 
                    @click="fetchLogs" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-800 hover:bg-yellow-700 text-white rounded-xl text-sm font-medium transition-colors w-fit"
                >
                    <span>Refrescar</span>
                </button>
            </div>

            <!-- Filtros -->
            <div class="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Buscar</label>
                    <input 
                        v-model="filters.search" 
                        @input="debounceSearch"
                        type="text" 
                        placeholder="Acción, usuario, email..." 
                        class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Entidad</label>
                    <select 
                        v-model="filters.entity" 
                        @change="fetchLogs(1)"
                        class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Todas</option>
                        <option value="User">Usuario</option>
                        <option value="Auth">Autenticación</option>
                        <option value="Role">Rol</option>
                        <option value="SystemLog">Sistema</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Desde</label>
                    <input 
                        ref="startDateInput"
                        type="text" 
                        placeholder="Seleccionar fecha..."
                        class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    />
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Hasta</label>
                    <input 
                        ref="endDateInput"
                        type="text" 
                        placeholder="Seleccionar fecha..."
                        class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    />
                </div>
            </div>

            <!-- Tabla -->
            <div class="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider select-none">
                                <!-- Fecha / Hora -->
                                <th @click="handleSort('createdAt')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Fecha / Hora</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <!-- Usuario -->
                                <th @click="handleSort('user')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Usuario</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'user' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'user' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <!-- Acción -->
                                <th @click="handleSort('action')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Acción</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'action' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'action' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <!-- Entidad -->
                                <th @click="handleSort('entity')" class="py-3 px-4 text-left cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <div class="flex items-center space-x-1">
                                        <span>Entidad</span>
                                        <span class="inline-flex flex-col text-[10px] leading-none">
                                            <span :class="sortBy === 'entity' && sortOrder === 'asc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▲</span>
                                            <span :class="sortBy === 'entity' && sortOrder === 'desc' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'">▼</span>
                                        </span>
                                    </div>
                                </th>

                                <!-- IP (Sin ordenamiento dinámico) -->
                                <th class="py-3 px-4 text-left">IP</th>

                                <!-- Detalles -->
                                <th class="py-3 px-4 text-right">Detalles</th>
                            </tr>
                        </thead>                   
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                            <tr v-if="loading">
                                <td colspan="6" class="text-center py-8 text-slate-400">Cargando registros...</td>
                            </tr>
                            <tr v-else-if="logs.length === 0">
                                <td colspan="6" class="text-center py-8 text-slate-400">No se encontraron eventos.</td>
                            </tr>
                            <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                <td class="py-3 px-4 font-mono text-xs whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
                                <td class="py-3 px-4">
                                    <div v-if="log.user" class="flex flex-col">
                                        <span class="font-medium text-slate-900 dark:text-white">{{ log.user.name }}</span>
                                        <span class="text-xs text-slate-400">{{ log.user.email }}</span>
                                    </div>
                                    <span v-else class="text-xs text-slate-400 italic">Sistema / Anónimo</span>
                                </td>
                                <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{{ log.action }}</td>
                                <td class="py-3 px-4">
                                    <span :class="getEntityBadgeClass(log.entity)" class="px-2.5 py-1 text-[11px] font-semibold rounded-lg border">
                                        {{ log.entity }}
                                    </span>
                                </td>
                                <td class="py-3 px-4 font-mono text-xs text-slate-400">{{ log.ipAddress || 'N/A' }}</td>
                                <td class="py-3 px-4 text-right">
                                    <button 
                                        v-if="log.details" 
                                        @click="openDetailsModal(log)" 
                                        class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                                    >
                                        Ver JSON
                                    </button>
                                    <span v-else class="text-xs text-slate-400">-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Paginación -->
                <div class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700">
                    <span class="text-xs text-slate-500 dark:text-slate-400">
                        Mostrando página {{ pagination.page }} de {{ pagination.totalPages }} ({{ pagination.total }} registros)
                    </span>
                    <div class="flex gap-2">
                        <button 
                            :disabled="pagination.page <= 1" 
                            @click="changePage(pagination.page - 1)" 
                            class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40"
                        >
                            Anterior
                        </button>
                        <button 
                            :disabled="pagination.page >= pagination.totalPages" 
                            @click="changePage(pagination.page + 1)" 
                            class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-40"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
            <!-- Modal de Detalles JSON -->
            <div v-if="selectedLogModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div class="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-1">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Detalles del Evento</h3>
                        <span class="text-xs text-slate-400 font-mono">{{ selectedLogModal.action }} - {{ formatDate(selectedLogModal.createdAt) }}</span>
                    </div>                
                    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-y-auto overflow-x-hidden max-h-[50vh] max-w-full">
                        <pre class="text-emerald-400 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed select-all">{{ formatJsonDetails(selectedLogModal.details) }}</pre>
                    </div>
                    <div class="flex justify-end">
                        <button 
                            @click="selectedLogModal = null" 
                            class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
    import { ref, onMounted, onUnmounted } from 'vue';
    import { adminService } from '@/services/admin.service';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    import 'flatpickr/dist/themes/dark.css';
    import { Spanish } from 'flatpickr/dist/l10n/es.js';

    const logs = ref([]);
    const loading = ref(false);
    const selectedLogModal = ref(null);

    const startDateInput = ref(null);
    const endDateInput = ref(null);
    let fpStart = null;
    let fpEnd = null;

    const filters = ref({
        search: '',
        entity: '',
        startDate: '',
        endDate: '',
    });

    const pagination = ref({
        page: 1,
        total: 0,
        totalPages: 1,
    });

    const sortBy = ref('createdAt');
    const sortOrder = ref('desc');
    
    const handleSort = (field) => {
        if (sortBy.value === field) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortBy.value = field;
            sortOrder.value = 'asc';
        }
        fetchLogs(1);
    };

    const fetchLogs = async (page = 1) => {
        // Si 'page' es un evento DOM o no es un número válido, forzamos página 1
        const targetPage = (typeof page === 'number' && !isNaN(page)) ? page : 1;
        
        pagination.value.page = targetPage;
        loading.value = true;

        try {
            const response = await adminService.getAuditLogs({
                page: pagination.value.page,
                limit: pagination.value.limit || 15,
                search: filters.value.search,
                entity: filters.value.entity,
                action: filters.value.action,
                startDate: filters.value.startDate,
                endDate: filters.value.endDate,
                sortBy: sortBy.value,
                sortOrder: sortOrder.value
            });

            const resData = response.data?.data || response.data || {};
            logs.value = resData.logs || [];
            pagination.value = resData.pagination || { page: 1, total: 0, totalPages: 1 };
        } catch (err) {
            console.error('Error al cargar logs:', err);
            logs.value = [];
        } finally {
            loading.value = false;
        }
    }; 

    let searchTimeout = null;
    const debounceSearch = () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            pagination.value.page = 1;
            fetchLogs();
        }, 400);
    };

    const changePage = (newPage) => {
        // Validar límites antes de hacer la petición
        if (newPage < 1 || newPage > pagination.value.totalPages) return;
        
        // Pasar 'newPage' directamente a fetchLogs
        fetchLogs(newPage);
    };    

    const openDetailsModal = (log) => {
        selectedLogModal.value = log;
    };

    const getEntityBadgeClass = (entity) => {
        switch (entity) {
            case 'User': return 'bg-blue-500/10 text-emerald-500 border-emerald-500/20';
            case 'Role': return 'bg-emerald-500/10 text-purple-500 border-purple-500/20';
            case 'Auth': return 'bg-amber-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-slate-500/20';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-ES', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });
    };

    const formatJsonDetails = (details) => {
        if (!details) return '';
        try {
            // Si viene como String, lo parseamos a Objeto. Si ya es Objeto, lo dejamos igual.
            const parsed = typeof details === 'string' ? JSON.parse(details) : details;
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            // Si no es un JSON válido, retornamos el texto tal cual
            return details;
        }
    };
    
    onMounted(() => {
        fetchLogs();

        const commonConfig = {
            locale: Spanish,
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd/m/Y',
            allowInput: true,
        };

        fpStart = flatpickr(startDateInput.value, {
            ...commonConfig,
            onChange: (selectedDates, dateStr) => {
                filters.value.startDate = dateStr;
                pagination.value.page = 1;
                fetchLogs();
            },
        });

        fpEnd = flatpickr(endDateInput.value, {
            ...commonConfig,
            onChange: (selectedDates, dateStr) => {
                filters.value.endDate = dateStr;
                pagination.value.page = 1;
                fetchLogs();
            },
        });
    });

    onUnmounted(() => {
        if (fpStart) fpStart.destroy();
        if (fpEnd) fpEnd.destroy();
    });
</script>