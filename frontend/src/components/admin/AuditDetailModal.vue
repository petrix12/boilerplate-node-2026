<!-- src/components/admin/AuditDetailModal.vue -->
<script setup>
import { computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    log: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue', 'close']);

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

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
        const parsed = typeof details === 'string' ? JSON.parse(details) : details;
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        return details;
    }
};

const handleClose = () => {
    isOpen.value = false;
    emit('close');
};
</script>

<template>
    <BaseModal
        v-model="isOpen"
        title="Detalles del Evento"
        max-width="max-w-2xl"
        @close="handleClose"
    >
        <div v-if="log" class="space-y-4">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {{ log.action }} - {{ formatDate(log.createdAt) }}
            </div>    
            <div class="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-y-auto overflow-x-hidden max-h-[50vh] max-w-full">
                <pre class="text-yellow-600 dark:text-yellow-400 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed select-all">{{ formatJsonDetails(log.details) }}</pre>
            </div>
        </div>

        <template #footer>
            <button 
                @click="handleClose" 
                class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
                Cerrar
            </button>
        </template>
    </BaseModal>
</template>