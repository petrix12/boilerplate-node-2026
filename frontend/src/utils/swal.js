/* src/utils/swal.js */
import Swal from 'sweetalert2';

export const getSwalTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const rootStyles = getComputedStyle(document.documentElement);
    
    // Obtenemos las variables o asignamos un color seguro según el modo actual
    const surfaceColor = rootStyles.getPropertyValue('--surface-app').trim() || (isDark ? '#1e293b' : '#ffffff');
    const textColor = rootStyles.getPropertyValue('--text-app').trim() || (isDark ? '#f8fafc' : '#1e293b');
    const borderColor = rootStyles.getPropertyValue('--border-app').trim() || (isDark ? '#334155' : '#e2e8f0');

    return Swal.mixin({
        background: surfaceColor,
        color: textColor,
        customClass: {
            popup: `rounded-2xl border shadow-2xl`,
            confirmButton: 'px-5 py-2.5 rounded-xl font-medium text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors',
            cancelButton: isDark 
                ? 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors'
                : 'px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors'
        },
        buttonsStyling: false,
        didOpen: (popup) => {
            popup.style.borderColor = borderColor;
        }
    });
};