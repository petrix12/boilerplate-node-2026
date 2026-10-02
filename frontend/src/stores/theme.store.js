/*  src/stores/theme.store.js */
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    // Inicializar leyendo del localStorage, o por defecto 'true' (modo oscuro) si no hay nada guardado
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Si hay un tema guardado lo usa; si no, por defecto será oscuro (true) en lugar de depender solo del sistema
    const isDark = ref(savedTheme ? savedTheme === 'dark' : (savedTheme === null ? true : prefersDark));

    // Función para aplicar o quitar la clase 'dark' en la etiqueta <html>
    const applyTheme = (dark) => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Aplicar al iniciar
    applyTheme(isDark.value);

    // Sancionar cambios y guardarlos en localStorage
    watch(isDark, (newValue) => {
        applyTheme(newValue);
        localStorage.setItem('theme', newValue ? 'dark' : 'light');
    });

    const toggleTheme = () => {
        isDark.value = !isDark.value;
    };

    return {
        isDark,
        toggleTheme,
    };
});