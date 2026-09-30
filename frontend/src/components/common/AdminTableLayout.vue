<!-- src/components/common/AdminTableLayout.vue -->
<script setup>
import { computed } from 'vue'
import { useVueTable, FlexRender } from '@tanstack/vue-table'
import * as TableCore from '@tanstack/vue-table'

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    // Nuevas props opcionales para Paginación de Servidor
    page: {
        type: Number,
        default: null
    },
    totalPages: {
        type: Number,
        default: null
    },
    total: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['page-change'])

// Detecta automáticamente si se está pasando paginación de servidor
const isServerPagination = computed(() => props.page !== null && props.totalPages !== null)

// Solo inicializamos TanStack si se proporcionan columnas y datos para el comportamiento por defecto
const hasCustomTable = computed(() => props.columns.length > 0);

const table = useVueTable({
    get data() { return props.data },
    get columns() { return props.columns },
    getCoreRowModel: TableCore.getCoreRowModel ? TableCore.getCoreRowModel() : undefined,
    getPaginationRowModel: TableCore.getPaginationRowModel ? TableCore.getPaginationRowModel() : undefined,
    getFilteredRowModel: TableCore.getFilteredRowModel ? TableCore.getFilteredRowModel() : undefined,
    getSortedRowModel: TableCore.getSortedRowModel ? TableCore.getSortedRowModel() : undefined,
})
</script>

<template>
    <div class="space-y-6">
        <!-- ZONA 1: Filtros Opcionales -->
        <slot name="filters" />

        <!-- ZONA 2: Contenedor Principal de la Tabla -->
        <div class="w-full bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            <!-- Slot para la tabla: Si se pasa el slot `#table`, se usa; si no, renderiza TanStack por defecto -->
            <slot name="table">
                <div v-if="hasCustomTable" class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead class="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase text-xs font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800">
                            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                                <th 
                                    v-for="header in headerGroup.headers" 
                                    :key="header.id"
                                    :class="['px-6 py-4', header.column.id === 'actions' ? 'text-right' : 'text-left']"
                                >
                                <span v-if="!header.isPlaceholder">
                                    <FlexRender 
                                        :render="header.column.columnDef.header" 
                                        :props="header.getContext()" 
                                    />
                                </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                            <!-- Estado de Carga -->
                            <tr v-if="loading">
                                <td :colspan="columns.length" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                    <div class="flex justify-center items-center space-x-2">
                                        <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Cargando registros...</span>
                                    </div>
                                </td>
                            </tr>

                            <!-- Sin Resultados -->
                            <tr v-else-if="table.getRowModel().rows.length === 0">
                                <td :colspan="columns.length" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                    No se encontraron registros disponibles.
                                </td>
                            </tr>

                            <!-- Filas de Datos -->
                            <tr 
                                v-for="row in table.getRowModel().rows" 
                                :key="row.id"
                                class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                <td 
                                    v-for="cell in row.getVisibleCells()" 
                                    :key="cell.id"
                                    class="px-6 py-4 whitespace-nowrap"
                                >
                                    <FlexRender 
                                        :render="cell.column.columnDef.cell" 
                                        :props="cell.getContext()" 
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </slot>

            <!-- ZONA 3: Paginación inteligente (Servidor o Local) -->
            <slot name="pagination">
                <!-- CASO A: Paginación de Servidor (Si se pasan las props page y totalPages) -->
                <div v-if="isServerPagination" class="px-4 sm:px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400 transition-colors">
                    <span class="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
                        Página <strong>{{ page }}</strong> de <strong>{{ totalPages }}</strong> <span v-if="total !== null">({{ total }} registros)</span>
                    </span>
                    <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button 
                            :disabled="page <= 1"
                            @click="emit('page-change', page - 1)"
                            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200"
                        >
                            Anterior
                        </button>
                        <button 
                            :disabled="page >= totalPages"
                            @click="emit('page-change', page + 1)"
                            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                <!-- CASO B: Paginación Local por defecto (TanStack Table) -->
                <div v-else-if="hasCustomTable" class="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div class="flex items-center space-x-2 text-center sm:text-left">
                        <span>Página <strong>{{ table.getState().pagination.pageIndex + 1 }}</strong> de <strong>{{ table.getPageCount() || 1 }}</strong> (<strong>{{ table.getFilteredRowModel().rows.length }}</strong> registros)</span>
                    </div>
                    <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button 
                            @click="table.previousPage()" 
                            :disabled="!table.getCanPreviousPage()"
                            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200"
                        >
                            Anterior
                        </button>
                        <button 
                            @click="table.nextPage()" 
                            :disabled="!table.getCanNextPage()"
                            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </slot>
        </div>
    </div>
</template>