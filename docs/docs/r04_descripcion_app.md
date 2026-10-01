# Descubriendo la Plataforma: Innovación, Seguridad y Control
Esta aplicación ha sido diseñada desde cero para ofrecer una experiencia de usuario fluida, segura y visualmente atractiva, combinando las mejores prácticas del desarrollo moderno con herramientas de Inteligencia Artificial integradas. Ya sea desde un teléfono móvil o un monitor de escritorio, su interfaz se adapta perfectamente y permite alternar entre modo claro y oscuro con un solo clic.

## Acceso y Seguridad de Primer Nivel
El primer contacto con la plataforma garantiza flexibilidad y protección. Los usuarios pueden registrarse e iniciar sesión utilizando el método tradicional o agilizar el proceso vinculando su cuenta de Google. Para entornos que requieren alta seguridad, el sistema cuenta con un flujo de verificación de correo electrónico antes de otorgar el acceso, además de un mecanismo seguro de recuperación de contraseñas mediante enlaces temporales.

## El Panel de Control y Personalización
Una vez dentro, el usuario es recibido por un panel principal intuitivo. Desde aquí, la navegación fluye naturalmente hacia la configuración del perfil, donde personalizar la cuenta es tan sencillo como arrastrar y soltar una imagen para actualizar el avatar. Cada acción importante en el sistema está respaldada por notificaciones interactivas y elegantes que confirman el éxito de la operación.

## Centro de Comando Administrativo
Para los administradores, la plataforma despliega todo su potencial a través de un ecosistema de gestión integral:
+ Control de Accesos (RBAC): Un sistema granular para crear roles, asignar permisos específicos y gestionar a los usuarios de la plataforma, asegurando que cada persona vea y haga solo lo que le corresponde.
+ Auditoría y Transparencia: Un registro detallado (logs) que actúa como la caja negra del sistema, capturando eventos clave y errores operativos para mantener el control total sobre lo que ocurre tras bambalinas.
+ Diagnóstico Inteligente: Una vista exclusiva que, mediante el uso de Inteligencia Artificial, analiza en tiempo real el estado del servidor, la base de datos y la interfaz, generando informes de salud del sistema al instante.

## Acompañamiento con Inteligencia Artificial
Lo que realmente distingue a esta plataforma es su asistente virtual integrado. A través de una discreta ventana flotante, los usuarios interactúan con una IA que conoce las entrañas del sistema. Esta ventana ha sido diseñada con ergonomía profesional: se puede mover libremente por la pantalla, maximizar para lecturas extensas o cerrar cuando no se necesite, conservando siempre el hilo de la conversación.

Todo el ecosistema está respaldado por una sección de documentación interactiva y estructurada, garantizando que tanto usuarios finales como futuros desarrolladores tengan a su disposición el conocimiento necesario para exprimir al máximo las capacidades del sistema.

---
+ Todas las vistas cuentan con un diseño elegante, moderno y responsivo.
+ Vista Home (`frontend/src/views/HomeView.vue`): Al ir a la url base de la aplicación, esta muestra una landing page muy sencilla, pero elegante y moderna, en donde puedes acceder a:
    * Si no esta logueado a:
        - Inicio de sesión
        - Registro
        - Documentación
    + Si estas logueado a:
        + Dashboard principal
        - Documentación
+ Vista Inicio (`frontend/src/views/auth/LoginView.vue`): En la pantalla de inicio de sesión puedes iniciar sesión del modo tradicional o con una cuenta de Google, también, si olvidaste tu contraseña, puedes seguir este link y recuperarla, en donde se te enviará un email, y podrás introducir una nueva clave. Si no estas registrado, podrás darle al link de registro y registrarte. Para hacer login solo debes proporcionar un email y un password.
+ Vista Registro (`frontend/src/views/auth/RegisterView.vue`): En la pantalla de registro, podrás registrarte mediante el método tradicional, proporcionando tu nombre, apellido, email y un password, o registrarte mediante una cuenta de google. También tiene un enlace a la página de inicio de sesión.
+ Vista de olvidaste tu contraseña (`frontend/src/views/auth/ForgotPasswordView.vue`): en esta página podrás ingresar un email, y esta te enviará un correo con un enlace a una página para recuperar la contraseña.
+ Vista recuperar contraseña (`frontend/src/views/auth/ResetPasswordView.vue`): para ingresar a esta vista, se hace mediante un enlace especial, que tiene cierto tiempo de vigencia, y dicho enlace te llega por email, si lo sigues solo debes proporcionar la nueva contraseña para recuperar tu cuenta.
+ Vista verificar email (`frontend/src/views/auth/VerifyEmailView.vue`): esta vista solo estará activa si la opción para esto esta activa en la variable de entorno MAIL_ENABLE_VERIFICATION del backend esta marcada como true, y en este caso, al registrarse, antes de permitirle ingresar a la aplicación, el usuario debera autenticarse por email, dando clic en el enlace, en donde lo llevará a esta vista, y desde aquí podrá ingresar a la aplicación.
+ Vista Dashboar principal (`frontend/src/views/DashboardView.vue`): te muestra una vista sencilla, pero moderna, cuenta con un Navbar que te indica en que vista te encuentras, un botón para cambiar el modo oscuro o claro de la app, un avatar seguido de tu nombre, asociado a un menú desplegable, en donde podrás ingresar a la configuración del usuario o cerrar sesión, si tienes permiso para ingresar al dashboard administrativo, te aparecerá un enlace que te dirijirá a el.
+ Vista configuración (`frontend/src/views/ProfileView.vue`): en esta vista podrá establecer su avatar, Cambiar su nombre y contraseña, es importante destacar que para suministrar un avatar se podrá hacer mediante el método tradicional o con la tecnología Drag Drop. Esta vista cuenta con mensajes sweetalert2 para notificar sobre las acciones correspondientes.
+ Vista Dasboard administrativo (`frontend/src/views/admin/AdminDashboardView.vue`): En esta vista podrás acceder a 
    * Gestión de usuarios
    * Administración de roles
    * Auditoria y logs
    * Diagnóstico del sistema por ia
+ Vista Administración de usuarios (`frontend/src/views/admin/UsersAdminView.vue`):aquí podrás ver la lista de usuarios, además de poder crear, editar y eliminar usuarios. también podrás establecer su rol.
+ Vista Administración de roles (`frontend/src/views/admin/RolesAdminView.vue`): aquí podrás ver un crud completo para roles y establecer permisos para dichos roles.
+ Vista Auditoria y logs (`frontend/src/views/admin/AuditLogsView.vue`): te permite ver una lista de registros relacionados con los crud de usuarios y roles, y errores capturados por el backend.
+ Vista de diagnóstioc de la aplicación (`frontend/src/views/admin/SystemDiagnosticView.vue`): esta vista solo aparecera si la aplicación tiene activa una ia, y en este pagina se mostrará un informe detallado de eventos importantes ocuridos en el backend, frontend, base de datos y analisis de los registros de auditoria y sistema. El prompt para ajustar el input de ese para la ia se encuentra en `backend/src/data/diagnostic-prompt.md`.
+ La aplicación muestra, si tiene la ia activa, un botón que al hacer clic, muestra una ventana flotante que te invita a hacerle preguntas sobre la aplicación, y como esta esta integrada a una ia, puede perfectamente chatear con el usuario. Para ajustar el prompt de esta se debe modificar o configurar el archivo `backend/src/data/ai-context.md`.
+ La aplicación usa sweetalert2 la cual muestra mensaje muy boinitos.
+ Cuenta con HeroIcon que nos permite usar iconos elegantes.
+ La aplicación de documentación esta hecha con vitepress, el cual es muy sencillo de configurar con el archivo `docs/docs/.vitepress/config.ts`.
+ Cuenta con un componente para crear tablas `frontend/src/components/common/AdminTableLayout.vue` y modales `frontend/src/components/common/BaseModal.vue` homologados.
+ Bien, esto es un resumen de lo que hace este boilerplate, y de lo que se me ocurre destacar, a ver si tu ves algo que a mi se me escapa, sobre todo si es importante, atractivo a algún casa talento, etc.

Bien, con toda esta información que te he dado, te pido dos cosas, la primera es que en base a esto, mejores este prompt `backend/src/data/ai-context.md`: 
# 🧠 AI System Context: Node/Vue Boilerplate 2026

## 1. Identidad y Propósito
Eres el asistente virtual oficial de este boilerplate monolítico (Node.js/Express + Vue 3). Tu objetivo es ayudar a los desarrolladores a entender la arquitectura, los módulos, los comandos y las decisiones técnicas tomadas en este proyecto. Responde de forma clara, técnica, concisa y basada exclusivamente en este contexto.

## 2. Stack Tecnológico Principal
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL.
- **Frontend:** Vue 3 (Composition API), Vite, Tailwind CSS, Pinia.
- **Autenticación:** JSON Web Tokens (JWT) y Google OAuth 2.0.
- **Almacenamiento:** Compatible con AWS S3, Minio y Supabase Storage.

## 3. Comandos Esenciales para el Desarrollador
- Levantar entorno local con Docker: `docker compose up --build -d`
- Ejecutar migraciones de base de datos: `npx prisma migrate dev`
- Poblar la base de datos con seeders: `npx prisma db seed`
- Iniciar servidor de desarrollo backend: `npm run dev`

## 4. Estructura de Módulos Clave
- **Autenticación (`/auth`):** Login, registro, verificación de email y OAuth con Google.
- **Gestión de Usuarios y Roles (`/users`, `/roles`):** Sistema RBAC (Role-Based Access Control) con permisos granulares.
- **Auditoría (`/audit`):** Middleware automático que registra acciones críticas del sistema (`AuditLog`).
- **Diagnóstico (`/diagnostic`):** Estado general del servidor, base de datos y servicios conectados.

para darle un buen contexto a la ia sin volverla loca y sin que me consuma todos los tokens.

y que me elabores un documento en markdown en donde explique de manera elegante, y sencilla a un usuario lo que hace la aplicación, teniendo en cuenta por ejemplo que un usuario no necesita saber esta ruta frontend/src/views/admin/UsersAdminView.vue, me explico?