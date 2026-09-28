<script setup>
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'
useThemeStore()
</script>

<template>
    <RouterView />
</template>