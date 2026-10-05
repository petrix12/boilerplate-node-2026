<!-- src/components/auth/LinkedInAuthButton.vue -->
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    text: {
        type: String,
        default: 'Continuar con LinkedIn'
    }
});

// Verificamos si la variable de entorno está presente para decidir si mostramos el botón
const clientId = import.meta.env.VITE_SOCIAL_LINKEDIN_CLIENT_ID;
const isConfigured = computed(() => {
    return clientId && clientId !== 'tu-linkedin-client-id' && clientId.trim() !== '';
});

const handleLinkedInLogin = () => {
    if (!isConfigured.value) return;

    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    const scope = 'openid profile email';
    
    // URL oficial de autorización de LinkedIn OAuth 2.0
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    window.location.href = linkedInAuthUrl;
};
</script>

<template>
    <div v-if="isConfigured" class="w-full relative">
        <button 
            type="button" 
            @click="handleLinkedInLogin"
            class="w-full h-[40px] flex items-center justify-center gap-3 px-4 rounded-lg bg-[#0A66C2] hover:bg-[#095196] text-white text-sm font-medium transition-colors shadow-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>{{ text }}</span>
        </button>
    </div>
</template>