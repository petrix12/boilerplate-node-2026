<!-- src/components/common/BaseModal.vue -->
<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    maxWidth: {
        type: String,
        default: 'max-w-2xl'
    },
    showCloseButton: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'close'])

const closeModal = () => {
    emit('update:modelValue', false)
    emit('close')
}

// --- LÓGICA DE ARRASTRE (Draggable) ---
const modalBoxRef = ref(null)
const offsetX = ref(0)
const offsetY = ref(0)
let isDragging = false
let startX = 0
let startY = 0

// Cada vez que el modal se abre, reseteamos su posición al centro exacto
watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        offsetX.value = 0
        offsetY.value = 0
    }
})

const startDrag = (e) => {
    // Evitamos arrastrar si el usuario hizo clic directamente en el botón de cerrar
    if (e.target.closest('button')) return

    isDragging = true
    startX = e.clientX - offsetX.value
    startY = e.clientY - offsetY.value

    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
    if (!isDragging) return
    offsetX.value = e.clientX - startX
    offsetY.value = e.clientY - startY
}

const stopDrag = () => {
    isDragging = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
}

onUnmounted(() => {
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @keydown.esc="closeModal">
            <!-- Backdrop -->
            <div 
                class="fixed inset-0 bg-slate-900/85 backdrop-blur-sm transition-opacity" 
                @click="closeModal"
            />

            <!-- Contenedor del Modal (Cambiado a un contenedor libre para permitir el drag) -->
            <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
                <Transition
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div 
                        ref="modalBoxRef"
                        class="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:w-full flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 pointer-events-auto"
                        :class="maxWidth"
                        :style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }"
                    >                        
                        <!-- Header Arrastrable -->
                        <div 
                            @mousedown="startDrag"
                            class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-move select-none"
                            title="Mantén presionado para mover"
                        >
                            <slot name="header">
                                <h3 class="text-base font-semibold text-slate-900 dark:text-white truncate">
                                    {{ title }}
                                </h3>
                            </slot>

                            <button
                                v-if="showCloseButton"
                                @click="closeModal"
                                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Cuerpo Principal -->
                        <div class="relative flex-1 p-6 overflow-auto">
                            <slot></slot>
                        </div>

                        <!-- Footer -->
                        <div v-if="$slots.footer" class="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center space-x-3">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </Transition>
</template>