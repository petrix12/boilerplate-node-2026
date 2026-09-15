# Starter Kit / Boilerplate Web (Decoupled Full-Stack)

Starter kit profesional desacoplado (Decoupled Architecture) para aplicaciones web modernas. Diseñado con **Node.js**, **Express**, **Prisma ORM**, **Vue 3**, *Pinia* y **PostgreSQL**, orquestado localmente mediante **Docker Compose** y preparado para despliegue en producción con arquitectura Free Tier Operations ($0.00 USD/mes).

---

## 🛠️ Stack Tecnológico
| Capa                  | Tecnología                                            | Infraestructura Cloud ($0 USD) |
| --------------------- | ----------------------------------------------------- | ------------------------------ |
| Frontend              | Vue 3 (Composition API) + Vite + Pinia + Vue Router   | Vercel                         |  
| Backend API           | Node.js + Express.js + Prisma ORM                     | Render.com                     |
| Base de Datos         | PostgreSQL 15                                         | Supabase Cloud                 |
| Storage (S3)          | AWS SDK (S3) / MinIO                                  | Supabase Storage               |
| Reverse Proxy Local   | Nginx                                                 | Docker / Local                 |

---

## 📐 Arquitectura del Sistema[ Capa de Presentación ]       [ Capa de Aplicación / API ]      [ Capa de Persistencia y Archivos ]

```
┌─────────────────────────┐     ┌───────────────────────────┐     ┌─────────────────────────────────┐
│     Frontend (SPA)      │     │      Backend (REST API)   │     │   Relational DB & S3 Storage    │
│  Vue 3 + Vite + Pinia   │ ──> │   Node.js + Express +     │ ──> │    PostgreSQL + Cloud Storage   │
│                         │     │        Prisma ORM         │     │            (Supabase)           │
└─────────────────────────┘     └───────────────────────────┘     └─────────────────────────────────┘
             │                                │                                │
             ▼                                ▼                                ▼
     Hosted en Vercel                Hosted en Render.com               Hosted en Supabase Cloud
```

---

## 📂 Estructura del Proyecto.
```Plaintext
├── backend/                  # API REST en Node.js + Express + Prisma
│   ├── prisma/               # Esquemas de BD, migraciones y seeders
│   ├── src/                  # Controladores, rutas, middlewares y servicios
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # SPA en Vue 3 + Vite + Pinia
│   ├── src/                  # Vistas, componentes, servicios y stores
│   ├── vercel.json           # Configuración de reescritura para rutas SPA
│   ├── Dockerfile
│   └── package.json
├── docs/                     # Documentación técnica del proyecto
├── nginx/                    # Configuración del Gateway Nginx local
│   └── default.conf
└── docker-compose.yml        # Orquestación de servicios en desarrollo local
```

---

## ⚙️ Desarrollo Local con Docker

1. Mapear el dominio local
Edita tu archivo hosts (`/etc/hosts` en Linux/WSL o `C:\Windows\System32\drivers\etc\hosts` en Windows):
    ```Plaintext
    127.0.0.1   boilerplate.test
    ```

2. Configurar variables de entorno
Crea el archivo `backend/.env` basándote en la configuración de Docker:
    ```env
    # ===================================================================================================
    # CONFIGURACIÓN DEL SERVIDOR BACKEND
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL - - -
    # ==========================================
    PORT=3000
    APP_URL=http://localhost:3000
    NODE_ENV=development
    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # PORT=10000
    # APP_URL=https://tu-proyecto.onrender.com
    # NODE_ENV=production

    # ===================================================================================================
    # CREDENCIALES DE SUPER ADMIN (PARA CREAR USUARIO ADMINISTRADOR)
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL Y PRODUCCIÓN - - -
    # ==========================================
    SUPER_ADMIN_EMAIL = admin@boilerplate.com
    SUPER_ADMIN_PASSWORD = tu_password_super_seguro

    # ===================================================================================================
    # CONFIGURACIÓN DEL SERVIDOR DE BASE DE DATOS
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL - - -
    # ==========================================
    DATABASE_URL="postgresql://dev_user:dev_password@postgres_dev:5432/boilerplate_db"
    DIRECT_URL="postgresql://dev_user:dev_password@postgres_dev:5432/boilerplate_db"
    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # DATABASE_URL="postgresql://postgres.<Project ID>:<Database password>@aws-X-<Región>.pooler.supabase.com:6543/postgres?pgbouncer=true"
    # DIRECT_URL="postgresql://postgres.<Project ID>:<Database password>@aws-X-<Región>.pooler.supabase.com:5432/postgres?pgbouncer=true"

    # ===================================================================================================
    # ALMACENAMIENTO S3
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL - - -
    # ==========================================
    S3_ENDPOINT="http://minio:9000"
    S3_REGION="us-east-1"
    S3_ACCESS_KEY_ID="minio_admin"
    S3_SECRET_ACCESS_KEY="minio_password123"
    S3_BUCKET_NAME="app-uploads"
    S3_FORCE_PATH_STYLE="true" # Obligatorio para MinIO y Supabase S3
    S3_PUBLIC_URL="http://localhost:9000/app-uploads"
    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # S3_ENDPOINT="https://<Project ID>.storage.supabase.co/storage/v1/s3"               
    # S3_REGION="<Región>"
    # S3_ACCESS_KEY_ID="<S3 Access Key>"
    # S3_SECRET_ACCESS_KEY="<S3 Secret Access Key>"
    # S3_BUCKET_NAME="app-uploads"
    # S3_FORCE_PATH_STYLE="true"
    # S3_PUBLIC_URL="https://<Project ID>.supabase.co/storage/v1/object/public/app-uploads"

    # ===================================================================================================
    # AUTENTICACIÓN (JWT)
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL - - -
    # ==========================================
    JWT_SECRET="familytree_dev_jwt_secret_key_2026_super_secure"
    JWT_EXPIRES_IN="7d"
    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # Esta token lo puedes generar con el comando: openssl rand -hex 32
    # JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX             
    # JWT_EXPIRES_IN=24h

    # ===================================================================================================
    # CONFIGURACIÓN DEL FRONTEND
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL - - -
    # ==========================================
    FRONTEND_URL=http://boilerplate.test
    FRONTEND_URL_LOCAL_VITE=http://localhost:5173
    FRONTEND_URL_LOCAL_VUE_CLI=http://localhost:8080
    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # FRONTEND_URL=https://boilerplate-node-2026.vercel.app
    ```

3. Levantar el entorno
    ```Bash
    # Construir e iniciar todos los contenedores
    docker compose up -d --build

    # Ejecutar migraciones y seeders iniciales
    docker compose exec backend npx prisma migrate dev
    docker compose exec backend node src/seeders/superadmin.seeder.js
    ```

4. Puntos de acceso local
    + Aplicación Web (Frontend): `http://boilerplate.test`.
    + API Health Check: `http://boilerplate.test/api/health`.
    + Prisma Studio (GUI de BD): `http://localhost:5555`.
    + MinIO Console (S3 Local): http://localhost:9001 (User: `minio_admin` | Pass: `minio_password123`)

---

## 🚀 Despliegue en Producción (CI/CD $0 USD)
1. Base de Datos & Storage (Supabase)
    + Crea un proyecto en Supabase y un Bucket público llamado `app-uploads`.
    + Copia la cadena de conexión URI desde `Project Settings > Database`.
    + Ejecuta las migraciones y seeders hacia Supabase desde la terminal de tu máquina:
        ```Bash
        # Migraciones
        DATABASE_URL="postgresql://<USER>.<PROJECT_REF>:<PASSWORD>@<POOLER_HOST>:6543/<DB>?pgbouncer=true" 
        DIRECT_URL="postgresql://<USER>.<PROJECT_REF>:<PASSWORD>@<POOLER_HOST>:5432/<DB>" npx prisma migrate deploy
        
        # Seeders
        DATABASE_URL="postgresql://<USER>.<PROJECT_REF>:<PASSWORD>@<POOLER_HOST>:5432/<DB>" node src/seeders/superadmin.seeder.js
        ```
2. Backend (Render)
    + Crea un Web Service en Render.com conectado al repositorio.
    + Configura los parámetros:
        + Root Directory: `backend`.
        + Build Command: `npm install && npx prisma generate`.
        + Start Command: `npm start`.
        + Variables de entorno en Render:
            + NODE_ENV: `production`.
            + DATABASE_URL: URL del Pooler de Supabase (`:6543`)
            + DIRECT_URL: URL Directa de Supabase (`:5432`)
3. Frontend (Vercel)
    + Importa el proyecto en Vercel definiendo como Root Directory: `frontend`.
    + Añade la variable de entorno:
        + VITE_API_BASE_URL: `https://tu-api-en-render.onrender.com/api/v1`.
        + Despliega. Las reescrituras de rutas SPA están automatizadas mediante `frontend/vercel.json`.

---

## 📄 Licencia
Este proyecto está distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.
