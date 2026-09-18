# 🚀 Despliegue en Producción (CI/CD $0 USD)

## Persistencia de Datos (Supabase PostgreSQL)
1. Crear un nuevo proyecto en Supabase.
2. Ir a `Project Settings` > `Database` y copiar la cadena de conexión URI (modo Transaction o Session).
3. Aplicar las migraciones desde tu entorno local hacia la base de datos de producción:
    ```bash
    DATABASE_URL="postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:6543/<DATABASE_NAME>?pgbouncer=true" 
    DIRECT_URL="postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:5432/<DATABASE_NAME>" npx prisma migrate deploy                
    ```
    + Estructura de variables para la documentación:
        + `<USER>`: Usuario por defecto de la base de datos (habitualmente postgres).
        + `<PROJECT_REF>`: Identificador único o Reference ID de tu proyecto en Supabase (ej. nwfbuoxducspziyazics).
        + `<ENCODED_PASSWORD>`: Contraseña de la base de datos con caracteres especiales codificados en formato URL (ejemplo: = se convierte en %3D, # en %23).
        + `<POOLER_HOST>`: Host del Connection Pooler asignado a tu región en Supabase (ej. aws-1-eu-west-1.pooler.supabase.com).
        + `<DATABASE_NAME>`: Nombre de la base de datos lógica (por defecto postgres).
        + DATABASE_URL (Puerto 6543): Conexión en modo Transaction (?pgbouncer=true) utilizada por la aplicación Node.js en producción.
        + DIRECT_URL (Puerto 5432): Conexión en modo Session que requiere Prisma CLI para ejecutar migraciones directas sin pasar por PgBouncer.

## Ejecutar seeder en producción (Supabase)
1. Abre la terminal en la carpeta de tu `backend`.
2. Ejecuta el comando de seed pasando la cadena de conexión de producción de Supabase:
    ```bash
    DATABASE_URL="postgres://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:<PORT>/<DATABASE_NAME>" npx prisma db seed
    DATABASE_URL="postgres://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:<PORT>/<DATABASE_NAME>" node src/seeders/superadmin.seeder.js
    ```
    + Asegúrate de reemplazar las credenciales por las reales de Supabase, tal como hiciste al aplicar las migraciones.

## API Backend (Render Web Service)
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
        + PORT: `10000`
        + APP_URL: `https://boilerplate-node.onrender.com`
        + NODE_ENV: `production`
        + DATABASE_URL: `postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:6543/<DATABASE_NAME>?pgbouncer=true`
        + DIRECT_URL: `postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:5432/<DATABASE_NAME>`
    + Haz clic en `Deploy Web Service`.
    + Copia la URL pública generada (ej. [https://boilerplate-node-2026.onrender.com](https://boilerplate-node-2026.onrender.com)).
3. Prueba de funcionamiento:
    + Verifica el endpoint:
        ```bash
        curl https://boilerplate-node-2026.onrender.com/api/health
        ```
## Configuración de Enrutamiento SPA en Vercel
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

## Capa de Presentación (Vercel)
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

## Proyecto de documentación (Vercel)
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