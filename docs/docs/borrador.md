# Sobre la App Web "Boilerplate Node.js | Vue.js 2026"

+ **Creador**: `Pedro Jesús Bazó Canelón`.
+ **Fecha de inicio del proyecto**: `06-09-2026`.

## Tecnologías utilizadas:
+ Capa de Presentación: Vue 3 | Vite | Pinia | Tailwindcss.
+ Backend (REST API): Node.js | Express | Prisma ORM
+ Relational DB & S3 Storage: PostgreSQL | Cloud Storage
+ Proyecto de documentación: VitePress
+ Infraestructura: 
    + Proyecto permite dockerización (realmente no se como poner esto)
    + Permite simular un servicio de S3 con Minio.
    + En el docker-compose también se contempla el servicio de PostgreSQL y servicio de Nginx para levantar el frontend y vitepress, etc.
+ El diseño de frontend se contempla el modo responsivo para adaptar las vista a pantellas chicas.

## ¿Qué hace la aplicación?
+ Al iniciar la aplicación en la raíz del proyecto muestra una vista de presentación (home), con un diseño sobrio, en donde invita a:
    + Registrarse o Iniciar Sesión
    + Ver documentación (Desarrollada con VitePress).
    + La documentación está pensada para que un desarrollador la pueda adaptar a su proyecto con solo proporcionar los archivos markdown de su interes y configurar el `config.ts`.
    + **Nota**: Es importante destacar que si no se proporciona la variable de entorno `VITE_DOCS_URL` en el frontend, no se mostrará el enlace para acceder a la documentación.
+ Las vistas para registrarse y hacer login tienen un diseño bastante sobrio y moderno, y permiten hacerlo:
    + Vía tradicional, proporcionando un password y una contraseña.
    + Vía autenticación por Google.
    + **Nota**: Es importanta destacar que si no se proporciona algunas de estas variables de entorno `GOOGLE_CLIENT_ID` o `GOOGLE_CLIENT_SECRET` en el backend, la opción de hacer login y register por Google quedará deshabilitada.
+ Luego de registrarse y hacer login, el usuario será redirigido al dashboard de la aplicación, el cual, igualmente tiene un diseño sobrio y moderno. Esta vista esta pensada para que el desarrollador la desmonte y la adapte a la naturaleza de su proyecto.
+ El dashboard de la app dispone de un Navbar con un diseño moderno, que muestra el logo de la empresa y el nombre de la aplicación, seguido de la vista en la que se encuentra, y al otro extremo un avatar del usuario logueado seguido de su nombre, que al hacer clic sobre ellos, se muestra un menú desplegable que permite ir al la vista de configuración del usuario y cerrar sesión.
+ La aplicación también contempla un sistema de roles y permisos, y si el usuario dispone de los permisos necesario para ir al panel de administración, este enlace también se mostrará en el menú desplegable.
+ La vista de configuración, es una vista moderna, en donde en principio se puede cambiar el avatar, el nombre y la contraseña.
+ En caso de que el usuario tenga permisos para ingresar al panel de administración, en el podrá apreciar cuatro enlaces, que lo podrán dirigir a:
    + Gestión de Usuarios (Creación, edición de datos personales, asignación de roles y eliminación).
    + Roles y Permisos (Administración de la tabla de roles globales del sistema (CRUD de Roles)).
    + Auditoría / Logs (Historial de cambios críticos y acciones de los administradores).
    + Diagnóstico del Sistema por IA (Análisis inteligente del estado, salud y seguridad global).
+ La aplicación tiene instalada la dependencia de sweelalert2, el cual muestra mensajes bastante cool cada vez que la aplicación necesita mostrar algún tipo de mensaje.
+ En cuanto al Diagnóstico del Sistema por IA es importante destacar que si no se suministra la variable de entorno `AI_API_KEY` en el backend, esta opción quedará deshabilitada y no se mostrará, ya que es opcional. El funcionamiento de esta es muy sencillo, el backend elabora un prompt en función de lecturas que hace del backend, frontend, base de datos y auditorias de sistemas previamente almacenados en registros en base de datos, los cuales tienen una duración de 30 días por defecto, pero esta cantidad de días es configurable en la vaiable de entorno `LOG_RETENTION_DAYS` del backend. Luego de preparar el prompt (el cual se puede adaptar mejor a las necesidades del desarrollador sin mucha complejidad), este es enviado mediante api a un servicio de ia, el cual devuelve una respuesta en un json el cual esta estrictamente estipulado en el prompt, y con esta información se rellenan los datos de la vista.
+ En cuanto a la vista de Auditoría / Logs, muestra registros de actividades realizadas principalmente en las tablas de usuarios y roles y también captura todos los errores que detecte el backend.



🚀 Node.js & Vue 3 Enterprise Boilerplate (2026) — Solución de alta ingeniería desarrollada por Pedro Bazó para acelerar el desarrollo de aplicaciones web robustas, escalables y preparadas para producción.

Este starter kit combina una arquitectura limpia y modular con un stack tecnológico moderno de alto rendimiento.

🛠️ Tecnologías Principales:

Backend: Node.js, Express, Prisma ORM, PostgreSQL.

Frontend: Vue 3, Pinia, Tailwind CSS.

Infraestructura y DevOps: Docker, Nginx, almacenamiento S3/Minio.

Características Avanzadas: Documentación con VitePress y sistema de diagnósticos integrados mediante IA (AI_API_KEY).

Ideal para optimizar flujos de trabajo, garantizar estándares de producción y escalar proyectos enterprise con total seguridad.

🌐 Conecta con el creador:

LinkedIn: https://www.linkedin.com/in/pedro-bazo

GitHub: https://github.com/petrix12

Contacto: pedro.j.bazo.c@gmail.com

#NodeJS #VueJS #FullStack #WebDevelopment #SoftwareEngineering #Prisma #TailwindCSS #Developer

