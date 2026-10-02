<!-- src/components/common/AIChatWidget.vue -->
<script setup>
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue';
import { marked } from 'marked';
import { useAIStore } from '@/stores/ai.store';

const aiStore = useAIStore();
const isOpen = ref(false);
const isMaximized = ref(false);
const inputMessage = ref('');
const messagesContainer = ref(null);

// Detectar ancho de pantalla reactivo para evitar problemas al redimensionar
const windowWidth = ref(window.innerWidth);
const handleResize = () => {
    windowWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

const isMobile = computed(() => windowWidth.value < 640);

// Obtener el nombre de la aplicación desde las variables de entorno de Vite
const appName = import.meta.env.VITE_APP_NAME || 'NodeVue Boilerplate';

// Configuración de marked
marked.setOptions({
    breaks: true,
    gfm: true,
});

const renderMarkdown = (content, role) => {
    if (role === 'user') return escapeHtml(content);
    return marked.parse(content);
};

const escapeHtml = (text) => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        scrollToBottom();
    }
};

const toggleMaximize = () => {
    if (isMobile.value) return; // En móvil no permitimos maximizar
    isMaximized.value = !isMaximized.value;
    scrollToBottom();
};

const handleSend = async () => {
    if (!inputMessage.value.trim() || aiStore.loadingChat) return;
    
    const text = inputMessage.value;
    inputMessage.value = '';
    
    await aiStore.sendMessage(text);
    scrollToBottom();
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

// Lógica para arrastrar la ventana del chat por la cabecera
const chatWindow = ref(null);
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
let startX = 0;
let startY = 0;

const startDrag = (e) => {
    if (isMaximized.value || isMobile.value) return; // No arrastrar si está maximizado o en móvil
    isDragging.value = true;
    startX = e.clientX - position.value.x;
    startY = e.clientY - position.value.y;
    
    window.addEventListener('pointermove', onDrag);
    window.addEventListener('pointerup', stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    position.value.x = e.clientX - startX;
    position.value.y = e.clientY - startY;
};

const stopDrag = () => {
    isDragging.value = false;
    window.removeEventListener('pointermove', onDrag);
    window.removeEventListener('pointerup', stopDrag);
};

const windowStyle = computed(() => {
    if (isMobile.value) {
        return {}; // En móvil se posiciona mediante clases CSS fijas
    }
    if (isMaximized.value) {
        return {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '85vh',
            maxWidth: '900px'
        };
    }
    return {
        transform: `translate(${position.value.x}px, ${position.value.y}px)`
    };
});
</script>

<template>
    <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <!-- Botón Flotante -->
        <button 
            v-if="!isOpen"
            @click="toggleChat"
            class="flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
            title="Asistente IA"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        </button>

        <!-- Ventana del Chat -->
        <div 
            ref="chatWindow"
            v-if="isOpen" 
            :style="windowStyle"
            :class="[
                'absolute bottom-16 right-0 sm:bottom-20 sm:right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200',
                isMaximized ? 'fixed' : 'w-[calc(100vw-2rem)] sm:w-[420px] h-[500px] sm:h-[550px]',
                'max-w-[calc(100vw-2rem)] sm:max-w-none'
            ]"
        >
            <!-- Header (Arrastrable solo en desktop) -->
            <div 
                @pointerdown="startDrag"
                class="bg-indigo-600 px-4 py-3 text-white flex items-center justify-between select-none sm:cursor-move"
            >
                <div class="flex items-center space-x-2 pointer-events-none">
                    <span class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    <h3 class="font-semibold text-sm truncate max-w-[200px] sm:max-w-none">Asistente IA ({{ appName }})</h3>
                </div>
                <div class="flex items-center space-x-2">
                    <!-- Botón Maximizar / Restaurar (Oculto en móvil) -->
                    <button 
                        @click.stop="toggleMaximize" 
                        class="hidden sm:inline-flex text-indigo-200 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-indigo-700 transition-colors" 
                        :title="isMaximized ? 'Restaurar' : 'Maximizar'"
                    >
                        <span v-if="isMaximized">🗗</span>
                        <span v-else>🗖</span>
                    </button>
                    <!-- Botón Cerrar -->
                    <button @click.stop="toggleChat" class="text-indigo-200 hover:text-white text-sm px-1.5 py-0.5 rounded hover:bg-indigo-700 transition-colors" title="Cerrar">✕</button>
                </div>
            </div>

            <!-- Contenedor de Mensajes -->
            <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-gray-50 dark:bg-gray-950">
                <div v-for="(msg, index) in aiStore.messages" :key="index" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
                    <div 
                        :class="[
                            'max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed',
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none whitespace-pre-wrap' 
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none prose dark:prose-invert'
                        ]"
                        v-html="renderMarkdown(msg.content, msg.role)"
                    ></div>
                </div>
                <div v-if="aiStore.loadingChat" class="flex justify-start">
                    <div class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs animate-pulse">
                        Pensando respuesta...
                    </div>
                </div>
            </div>

            <!-- Input de Texto -->
            <div class="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center space-x-2">
                <input 
                    v-model="inputMessage"
                    @keyup.enter="handleSend"
                    type="text" 
                    placeholder="Pregúntame sobre esta aplicación..." 
                    class="flex-1 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 text-gray-800 dark:text-gray-100 text-sm rounded-xl px-4 py-2 focus:outline-none"
                />
                <button 
                    @click="handleSend"
                    :disabled="aiStore.loadingChat"
                    class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                    Enviar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(p) {
    margin-bottom: 0.5rem;
}
:deep(p:last-child) {
    margin-bottom: 0;
}
:deep(ul) {
    list-style-type: disc;
    margin-left: 1.25rem;
    margin-bottom: 0.5rem;
}
:deep(ol) {
    list-style-type: decimal;
    margin-left: 1.25rem;
    margin-bottom: 0.5rem;
}
:deep(strong) {
    font-weight: 600;
}
:deep(code) {
    background-color: rgba(0, 0, 0, 0.08);
    padding: 0.15rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.85em;
}
.dark :deep(code) {
    background-color: rgba(255, 255, 255, 0.15);
}
</style>