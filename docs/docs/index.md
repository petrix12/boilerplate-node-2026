# Bolierplate Node.js | Vue.js 2026

## 💡 [Incepción del Proyecto](p01_incepcion)
## 🟢 [Instalación de Node.js mediante NVM en WSL (Ubuntu)](p02_instalacion_node)
## 💻 [Estructuración Local y Control de Versiones (Git & GitHub)](p03_estructuracion)
## 🐳 [Dockerización](p04_dockerizacion)
## 🚀 [Despliegue en Producción (CI/CD $0 USD)](p05_deploy)
## 🔐 [Variables de entorno](p06_env)
## ⚙️ [Desarrollo del Backend](p07_backend)
## 🔌 [Endpoints](p08_endpoints)
## 💻 [Desarrollo del Frontend](p09_frontend)
## 📋 [Aplicación para documentación](p10_app_documentacion)
---
## 🔗 [URL de interes](r01_url)

---
## --------------------------------------------------------        

- [ ] Tarea pendiente o sin seleccionar
- [x] Tarea completada o seleccionada (también sirve [X])

- ✅ Tarea completada o seleccionada
- ◻️ Tarea pendiente o sin seleccionar


## --------------------------------------------------------

```text
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
```


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
        ```bash
        docker compose exec backend npx prisma migrate reset --force
        # o en su forma definida en el package.json
        docker compose exec backend npm run db:reset
        ```
    + Evitar el inicio de un contenedor:
        ```bash
        docker update --restart=no nombre_contenedor
        ```
2. **Ubuntu**:
    + Ver estructura de carpetas sin las carpetas node_modules ni archivo ocultos
        ```bash
        tree --dirsfirst -I "node_modules|vendor|.git|temporal|uploads|migrations|borrador.md"
        ```
        + Instalación de tree en sistemas basados en Red Hat / Fedora / CentOS:
            ```bash
            sudo apt update && sudo apt install tree
            ```

## Tares
### Pendientes
+ [ ] Recuperar credenciales (¿Olvidó su password?).
+ [ ] Establecer politicas de seguridad en tablas de base de datos de supabase.
+ [ ] Login con redes sociales.
+ [ ] Multi-idiomas.
+ [ ] Drag and Drop para gestionar archivos.
+ [ ] Solicitar autenticación de email.
+ [ ] Diagnóstico de la aplicación con IA.
+ [ ] Revisar la seguridad del backend.
+ [ ] Seguridad y Hardening HTTP (Backend): helmet para configurar cabeceras HTTP seguras. | 
+ [ ] Seguridad y Hardening HTTP (Backend): express-rate-limit para prevención de ataques de fuerza bruta en rutas críticas (/login, /register, /forgot-password).
+ [ ] Seguridad y Hardening HTTP (Backend): Desinfección de entrada contra inyecciones SQL / XSS y sanitización de payloads JSON.
+ [ ] Documentación & CI/CD (Swagger, .env.example, pruebas unitarias básicas).
+ [ ] Incluir ruta de documentación.
+ [ ] Realizar pruebas unitarias.
+ [ ] Que aparezca la manito cuando el maouse se posicione sobre un botón, o algo por el estilo.
+ [ ] Asegurar que los endpoints en el backend se puedan ejecutar según los permisos que les corresponde.
+ [ ] Verificar si es necesario variable de entorno IA_ACTIVE.
+ [ ] Crear example.env o como se llame.
+ [ ] Limpiar proyecto frontend de archivos que no se usan.
+ [ ] Implementar mensaje sweetalert en todos los lugares que haga falta.
+ [ ] Crear plantillas para las vistas y crear componentes para que las vistas no sean tan grandes.
+ [ ] Indicar la creación de los archivos README.md y LICENSE


### Terminadas
+ [x] Dockerización.
+ [x] Refactorización de rutas y controladores en el backend.
+ [x] Adecuar la aplicación para que sea mas general, por ejemplo cambiar familytree2026-backend por backend, adaptar la vista del home, etc.
+ [x] CRUD avatars en User Admin.
+ [x] Refactorizar para acceder a las vistas administrativas con permisos y no con roles.
+ [x] Homologar vistas admin.
