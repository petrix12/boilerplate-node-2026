# Bolierplate Node.js | Vue.js 2026

## 💡 [Incepción del Proyecto](p01_incepcion.md)
## 🟢 [Instalación de Node.js mediante NVM en WSL (Ubuntu)](p02_instalacion_node.md)
## 💻 [Estructuración Local y Control de Versiones (Git & GitHub)](p03_estructuracion.md)
## 🐳 [Dockerización](p04_dockerizacion.md)
## 🚀 [Despliegue en Producción (CI/CD $0 USD)](p05_deploy.md)
## 🔐 [Variables de entorno](p06_env.md)
## ⚙️ [Desarrollo del Backend](p07_backend.md)
## 🔌 [Endpoints](p08_endpoints.md)
## 💻 [Desarrollo del Frontend](p09_frontend.md)

## --------------------------------------------------------        



## --------------------------------------------------------


.
├── Dockerfile
├── README.md
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── logo.png
├── src
│   ├── App.vue
│   ├── api
│   │   └── axios.js
│   ├── assets
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components
│   │   ├── HelloWorld.vue
│   │   ├── Navbar.vue
│   │   ├── TheWelcome.vue
│   │   ├── WelcomeItem.vue
│   │   └── icons
│   │       ├── IconCommunity.vue
│   │       ├── IconDocumentation.vue
│   │       ├── IconEcosystem.vue
│   │       ├── IconSupport.vue
│   │       └── IconTooling.vue
│   ├── layouts
│   │   └── AppLayout.vue
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── services
│   │   ├── admin.service.js
│   │   └── roles.service.js
│   ├── stores
│   │   ├── auth.store.js
│   │   └── counter.js
│   └── views
│       ├── AboutView.vue
│       ├── DashboardView.vue
│       ├── HomeView.vue
│       ├── LoginView.vue
│       ├── NotFoundView.vue
│       ├── ProfileView.vue
│       ├── RegisterView.vue
│       └── admin
│           ├── AdminDashboardView.vue
│           ├── AuditLogsView.vue
│           ├── RolesAdminView.vue
│           └── UsersAdminView.vue
├── vercel.json
└── vite.config.js

13 directories, 44 files



## A mano
1. **Docker**:
    + Ver todos los logs:
        ```bash
        docker compose logs -f
        ```
    + Ver solo los logs de servicios específicos (ej. Backend y Frontend):
        ```bash
        docker compose logs -f backend frontend
        ```
    + Ver las últimas N líneas de logs (ej. 50 líneas por servicio) y seguir escuchando:
        ```bash
        docker compose logs -f --tail=50
        ```
    + Resetear base de datos
        ```
        docker compose exec backend npx prisma migrate reset --force
        # o en su forma definida en el package.json
        docker compose exec backend npm run db:reset
        ```

## Tares
### Pendientes
+ [ ] CRUD avatars en User Admin.
+ [ ] Login con redes sociales.
+ [ ] Solicitar autenticación de email.
+ [ ] Sección de suscripción (Con planes)
+ [ ] Multi-idiomas
+ [ ] Drag and Drop para gestionar archivos
+ [ ] Establecer politicas de seguridad en tablas de base de datos de supabase
+ [ ] Revisar la seguridad del backend

### Terminadas
+ [x] Dockerización.
+ [x] Refactorización de rutas y controladores en el backend.
+ [x] Adecuar la aplicación para que sea mas general, por ejemplo cambiar familytree2026-backend por backend, adaptar la vista del home, etc.
