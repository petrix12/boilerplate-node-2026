import { defineStore } from 'pinia';
import { ref } from 'vue';
import { diagnosticService } from '@/services/diagnostic.service';

export const useDiagnosticStore = defineStore('diagnostic', () => {
    const report = ref(null);
    const timestamp = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchDiagnostic = async (forced = false) => {
        // Si ya tenemos un reporte y no se fuerza la recarga, evitamos la llamada
        if (report.value && !forced) {
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const response = await diagnosticService.getSystemDiagnostic();
            report.value = response.data;
            timestamp.value = new Date().toISOString(); // Guardamos la fecha y hora exacta
        } catch (err) {
            error.value = err.response?.data?.message || 'Error al conectar con el servicio de diagnóstico.';
            throw err; // Opcional: relanzar para que la vista lo maneje si es necesario
        } finally {
            loading.value = false;
        }
    };

    return {
        report,
        timestamp,
        loading,
        error,
        fetchDiagnostic
    };
});