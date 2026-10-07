<script setup>
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'
import CookieConsent from '@/components/common/CookieConsent.vue';
useThemeStore()
</script>

<template>
    <RouterView />
    <CookieConsent />
</template>