# 🚀 Despliegue en Producción (CI/CD $0 USD)

## 🗄️ Persistencia de Datos (Supabase PostgreSQL)
1. Crear un nuevo proyecto en Supabase.
2. Ir a `Project Settings` > `Database` y copiar la cadena de conexión URI (modo Transaction o Session).
3. Aplicar las migraciones desde tu entorno local hacia la base de datos de producción:
    ```bash
    DB_URL="postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:6543/<DATABASE_NAME>?pgbouncer=true" 
    DB_DIRECT_URL="postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:5432/<DATABASE_NAME>" npx prisma migrate deploy                
    ```
    + Estructura de variables para la documentación:
        + `<USER>`: Usuario por defecto de la base de datos (habitualmente postgres).
        + `<PROJECT_REF>`: Identificador único o Reference ID de tu proyecto en Supabase (ej. nwfbuoxducspziyazics).
        + `<ENCODED_PASSWORD>`: Contraseña de la base de datos con caracteres especiales codificados en formato URL (ejemplo: = se convierte en %3D, # en %23).
        + `<POOLER_HOST>`: Host del Connection Pooler asignado a tu región en Supabase (ej. aws-1-eu-west-1.pooler.supabase.com).
        + `<DATABASE_NAME>`: Nombre de la base de datos lógica (por defecto postgres).
        + DB_URL (Puerto 6543): Conexión en modo Transaction (?pgbouncer=true) utilizada por la aplicación Node.js en producción.
        + DB_DIRECT_URL (Puerto 5432): Conexión en modo Session que requiere Prisma CLI para ejecutar migraciones directas sin pasar por PgBouncer.

## 🌱 Ejecutar seeder en producción (Supabase)
1. Abre la terminal en la carpeta de tu `backend`.
2. Ejecuta el comando de seed pasando la cadena de conexión de producción de Supabase:
    ```bash
    DB_URL="postgres://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:<PORT>/<DATABASE_NAME>" npx prisma db seed
    DB_URL="postgres://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:<PORT>/<DATABASE_NAME>" node src/seeders/superadmin.seeder.js
    ```
    + Asegúrate de reemplazar las credenciales por las reales de Supabase, tal como hiciste al aplicar las migraciones.

## ⚙️ API Backend (Render Web Service)
1. Creación de Cuenta y Vinculación con GitHub:
    + Accede a [render.com](https://render.com/) y haz clic en Get Started.
    + Selecciona Sign Up with GitHub para autorizar el acceso a tus repositorios.
2. Creación del Web Service:
    + En el Dashboard de Render, haz clic en New + y selecciona Web Service.
    + Elige tu repositorio del backend (boilerplate-node).
    + Completa los campos de configuración:
        + Name: `boilerplate-node`.
        + Branch: `master`.
        + Region: `Frankfurt (EU Central)` o la más cercana a tu base de datos.
        + Root Directory: `backend`.
        + Runtime: Node
        + Build Command: npm install && npx prisma generate
        + Start Command: npm start (o node server.js / node index.js, dependiendo de cómo arranques tu servidor en el package.json)
        + Instance Type: Free ($0/mo)
    + Configuración de Variables de Entorno: Desplázate hasta la sección Environment Variables y añade:
        + APP_PORT: `10000`
        + APP_URL: `https://boilerplate-node.onrender.com`
        + APP_ENV: `production`
        + DB_URL: `postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:6543/<DATABASE_NAME>?pgbouncer=true`
        + DB_DIRECT_URL: `postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:5432/<DATABASE_NAME>`
    + Haz clic en `Deploy Web Service`.
    + Copia la URL pública generada (ej. [https://boilerplate-node-2026.onrender.com](https://boilerplate-node-2026.onrender.com)).
3. Prueba de funcionamiento:
    + Verifica el endpoint:
        ```bash
        curl https://boilerplate-node-2026.onrender.com/api/health
        ```

## 🧭 Configuración de Enrutamiento SPA en Vercel
1. Crea un archivo llamado `vercel.json` en la raíz de tu proyecto frontend (`frontend/vercel.json`) con el siguiente contenido:
    ```json
    {
        "rewrites": [
            {
                "source": "/(.*)",
                "destination": "/index.html"
            }
        ]
    }
    ```
2. Sube los cambios a tu repositorio:
    ```bash
    git add vercel.json
    git commit -m "fix: add vercel rewrites for SPA routing"
    git push origin main
    ```

## 🎨 Capa de Presentación (Vercel)
1. Creación de Cuenta:
    + Accede a vercel.com mediante Continue with GitHub.
    + En el onboarding, selecciona "I'm working on personal projects" para habilitar el plan Hobby 100% gratuito (sin tarjeta).
    + En el aviso de seguridad 2FA, selecciona "Skip securing my account".
    + Haz clic en `Add New... > Project` e importa `boilerplate-node-2026`.
2. Importación y Despliegue del Frontend:
    + En el Dashboard, haz clic en Add New... > Project.
    + Importa el repositorio del frontend (`boilerplate-node-2026`).
    + Root Directory: `frontend`.
3. Ajustes de Build & Runtime (En caso de ser necesario):
    + En `Settings > Build and Deployment`:
        + Node.js Version: 20.x
        + Install Command (Override): npm install --legacy-peer-deps (evita errores ERESOLVE por peer dependencies de paquetes como oxlint).
4. Variables de Entorno en Vercel:
    + En Settings > Environment Variables:
        + Key: VITE_API_BASE_URL
        + Value: "https://boilerplate-node-2026.onrender.com/api/v1"
5. Despliegue Final:
    + Haz clic en Deploy. Tras guardar o cambiar variables de entorno, ejecuta siempre un Redeploy (sin usar Build Cache) para inyectar la URL de la API en los archivos estáticos de React/Vite.

## 📖 Proyecto de documentación (Vercel)
1. Importación y Despliegue de VitePress:
    + En el Dashboard, haz clic en `Add New... > Project`.
    + Importa el repositorio del frontend (`boilerplate-node-2026`).
    + Project Name: `boilerplate-node-2026-docs`.
2. Configuración a tener en cuenta:
    + Sttings > Build and Deployement:
        + Project Settings:
            + Framework Preset: `VitePress`.
            + Build Command: `npx vitepress build docs`.
            + Output Directory: `docs/.vitepress/dist`.
            + Install Command: Override.
            + Development Command: `npx vitepress dev . --port $PORT`.
        + Root Directory: `docs`.
    + Domains:
        + Add Domains: `boilerplate-node-2026-docs-docs.vercel.app`.
        + Connect to an environment: Production.
        + Clic en `Add O Domains`.
    + Deployments: Hacer `Deploy` o `Redeploy`.

## 🪤 Obtener Credenciales de Mailtrap (Cliente de correo para desarrollo)
+ Mailtrap es una herramienta de prueba de correo electrónico (Email Sandbox) que permite interceptar los correos salientes de tu entorno de desarrollo local sin enviarlos a usuarios reales, evitando errores de entrega accidentales.
1. Crear una cuenta en Mailtrap
    + Ve al sitio web oficial: mailtrap.io.
    + Haz clic en el botón de registro (Sign Up o Get Started Free).
    + Puedes registrarte utilizando una cuenta existente de Google, GitHub o introduciendo tu correo electrónico y contraseña.
    + Completa el proceso de verificación inicial si el sistema lo requiere.
2. Crear una Bandeja de Entrada (Inbox) para el Proyecto: Una vez dentro de tu panel principal (Dashboard):
    + Dirígete a la sección Email Sandbox en el menú lateral y selecciona Inboxes.
    + Haz clic en el botón Add Inbox (o Create Inbox).
    + Dale un nombre descriptivo a tu bandeja (por ejemplo: boilerplate-dev o el nombre de tu aplicación) y guárdala.
3. Obtener las Credenciales SMTP:
    + Haz clic sobre la bandeja de entrada que acabas de crear.
    + Por defecto, estarás en la pestaña Integrations (Integraciones).
    + En el menú desplegable de integraciones (donde dice "Show Credentials"), selecciona Node.js (o busca la opción genérica SMTP).
    + Verás los parámetros de configuración necesarios que Mailtrap genera de forma única para tu bandeja:
        + Host: sandbox.smtp.mailtrap.io (o similar)
        + Port: 2525 (o 465 / 587)
        + User: (un código alfanumérico largo generado por Mailtrap)
        + Password: (un token secreto generado por Mailtrap)
4. Configurar el archivo `.env` del Backend
    + Copia los valores obtenidos en el paso anterior e ingrésalos en el archivo .env ubicado en la carpeta backend/ de tu proyecto:
        ```ini
        MAIL_HOST=sandbox.smtp.mailtrap.io
        MAIL_PORT=2525
        MAIL_USER=tu_usuario_proporcionado_por_mailtrap
        MAIL_PASS=tu_password_proporcionado_por_mailtrap

        # Configuración adicional del servicio de correo
        MAIL_ENABLE_VERIFICATION=true
        MAIL_FROM=no-reply@tuapp.com
        ```

## 📬 Obtener Credenciales de Brevo (Cliente de correo para producción)
1. Instalar dependencia de Brevo:
    ```bash
    npm install @getbrevo/brevo
    ```
2. Crear tu cuenta en Brevo:
    + Entra a `brevo.com` y regístrate de manera gratuita.
    + Completa los pasos de verificación de perfil e identidad que solicitan para prevenir spam.
3. Obtener tus credenciales SMTP:
    + Una vez dentro de tu panel, haz clic en tu nombre o perfil (esquina superior/inferior derecha) y selecciona SMTP & API.
    + Ve a la pestaña SMTP.
    + Verás los datos de tu servidor SMTP generados por Brevo (si no ves una clave principal, puedes generar una nueva en "Generate a new SMTP key"). Los datos clave son:
        + Host: smtp-relay.brevo.com
        + Port: 587 (o 465)
        + User: (tu correo electrónico registrado en Brevo)
        + Password: (la clave SMTP larga que te generó el sistema)
4. Validar tu dominio o remitente (Muy importante para producción):
    + Para evitar que los correos de verificación lleguen a la bandeja de SPAM de tus usuarios:
        + En el panel de Brevo, ve a la sección de configuración de Senders & Domains (Remitentes y dominios).
        + Añade tu propio dominio (o un correo verificado con el dominio de tu app) para configurar los registros DNS (SPF, DKIM). Nota: Si estás en fases muy tempranas de prueba en producción, puedes validar un correo personal, pero lo profesional es usar tu propio dominio web.
5. Actualizar las variables de entorno en Render:
    + Ve al panel de control de tu servicio en Render, entra a la sección de Environment Variables y actualiza los valores con los de Brevo:
        ```ini
        MAIL_HOST=smtp-relay.brevo.com
        MAIL_PORT=587
        MAIL_USER=tu_correo_de_registro@brevo.com
        MAIL_PASS=tu_clave_smtp_larga_de_brevo
        MAIL_ENABLE_VERIFICATION=true
        MAIL_FROM=soporte@tudominio.com
        ```
