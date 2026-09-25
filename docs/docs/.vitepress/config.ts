import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "Boilerplate Node.js | Vue.js 2026",
    description: "Documentación oficial del proyecto boilerplate 2026",
    lang: 'es-ES',
    ignoreDeadLinks: true,
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],    
    themeConfig: {
        // Barra de navegación superior
        nav: [
            { text: 'Inicio', link: '/' },
            { text: 'Incepción', link: '/p01_incepcion' }
        ],

        // Barra lateral automática con todos tus capítulos ordenados
        sidebar: [
            {
                text: 'Índice del Boilerplate',
                items: [
                    { text: '💡 Incepción del Proyecto', link: '/p01_incepcion' },
                    { text: '🟢 Instalación de Node.js (WSL)', link: '/p02_instalacion_node' },
                    { text: '💻 Estructuración Local y Git', link: '/p03_estructuracion' },
                    { text: '🐳 Dockerización', link: '/p04_dockerizacion' },
                    { text: '📱 Credenciales en Redes Sociales', link: '/p05_social_media' },
                    { text: '🚀 Despliegue en Producción', link: '/p06_deploy' },
                    { text: '🔐 Variables de entorno', link: '/p07_env' },
                    { text: '⚙️ Desarrollo del Backend', link: '/p08_backend' },
                    { text: '🔌 Endpoints', link: '/p09_endpoints' },
                    { text: '💻 Desarrollo del Frontend', link: '/p10_frontend' },
                    { text: '📋 Aplicación para documentación', link: '/p11_app_documentacion' }
                ]
            },
            {
                text: 'Recursos',
                items: [
                    { text: '🔗 URL de interés', link: '/r01_url' },
                    { text: '🧪 Pruebas unitarias', link: '/r02_test' }
                ]
            }
        ],
        
        // Enlace directo al repositorio de GitHub para editar o ver el código
        socialLinks: [
            { icon: 'github', link: 'https://github.com/petrix12/boilerplate-node-2026' }
        ],       

        // Textos de la interfaz en español
        outlineTitle: 'En esta página',
        lastUpdatedText: 'Última actualización',
        docFooter: {
            prev: 'Página anterior',
            next: 'Página siguiente'
        }    
    }
})