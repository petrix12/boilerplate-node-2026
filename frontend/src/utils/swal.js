import Swal from 'sweetalert2';

export const getSwalTheme = () => {
    // Obtenemos los estilos calculados del elemento raíz del documento
    const rootStyles = getComputedStyle(document.documentElement);
    
    const surfaceColor = rootStyles.getPropertyValue('--surface-app').trim();
    const textColor = rootStyles.getPropertyValue('--text-app').trim();
    const borderColor = rootStyles.getPropertyValue('--border-app').trim();

    const isDark = document.documentElement.classList.contains('dark');

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
        // Inyectamos dinámicamente el color del borde mediante estilo en línea por popup
        didOpen: (popup) => {
            popup.style.borderColor = borderColor;
        }
    });
};