# 🔐 Variables de entorno

## ⚙️ Backend
1. Variables de Entorno del Backend (`backend/.env`):
    ```ini
    # ===================================================================================================
    # CONFIGURACIÓN DEL SERVIDOR BACKEND
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL - - -
    # ==========================================
    PORT=3000
    APP_URL=http://localhost:3000
    APP_INFRASTRUCTURE=Entorno de desarrollo local (Node.js nativo)
    NODE_ENV=development

    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # PORT=10000
    # APP_URL=https://boilerplate-node-2026.onrender.com
    # APP_INFRASTRUCTURE=Servidor VPS Linux nativo gestionado mediante PM2 / Systemd
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

    # ===================================================================================================
    # IA Diagnostic Configuration
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL | PRODUCCIÓN - - -
    # ==========================================
    AI_PROVIDER=groq
    AI_API_KEY=gsk_tu_clave_aqui_xxxxxxxxx
    AI_MODEL=qwen/qwen3.8-27b
    LOG_RETENTION_DAYS=30
    ```
2. Actualizar variables de entorno en `https://render.com`.

## 💻 Frontend
1. Variables de Entorno del Frontend (`frontend/.env`):
    ```ini
    # ===================================================================================================
    # CONFIGURACIÓN DEL SERVIDOR FRONTEND
    # ===================================================================================================
    # ==========================================
    # - - - LOCAL - - -
    # ==========================================
    # Con Docker
    VITE_API_BASE_URL=http://boilerplate.test/api/v1
    # Sin Docker
    # VITE_API_BASE_URL=http://localhost:3000/api/v1
    VITE_APP_NAME="NodeVue Boilerplate | Dev"
    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # VITE_API_BASE_URL=https://tu-proyecto.onrender.com/api/v1
    # VITE_APP_NAME="Node|Vue Boilerplate"
    ```
2. Actualizar variables de entorno en `https://vercel.com`.
