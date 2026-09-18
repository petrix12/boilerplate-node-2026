# 🐳 Dockerización
## Paso 1: Mapear el dominio local en tu Sistema Operativo
  + Abre el archivo hosts de tu sistema con permisos de administrador:
      + Windows (WSL): `C:\Windows\System32\drivers\etc\hosts`.
      + Linux/WSL: `/etc/hosts`.
  + Agrega estas líneas al final:
      ```text
      127.0.0.1   boilerplate.test
      127.0.0.1   docs.boilerplate.test
      ```
## Paso 2: Dockerización del Backend
  + Crea `backend/.dockerignore`:
      ```docker
      node_modules
      npm-debug.log
      .env
      .git
      .gitignore
      README.md
      dist        
      ```
  + Crea `backend/Dockerfile`:
      ```docker
      FROM node:20-alpine AS base

      WORKDIR /usr/src/app

      # Dependencias para Prisma / OpenSSL en Alpine
      RUN apk add --no-cache openssl

      COPY package*.json ./
      COPY prisma ./prisma/

      RUN npm ci
      RUN npx prisma generate

      COPY . .

      EXPOSE 3000

      CMD ["npm", "run", "dev"]
      ```
## Paso 3: Dockerización del Frontend
  + Crea `frontend/.dockerignore`:
      ```docker
      node_modules
      dist
      .git
      .gitignore
      README.md
      ```
  + Crea `frontend/Dockerfile`:
      ```docker
      FROM node:20-alpine

      WORKDIR /usr/src/app

      COPY package*.json ./

      RUN npm ci

      COPY . .

      EXPOSE 5173

      CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
      ```
## Paso 4: Configurar Nginx Reverse Proxy
  + Crea una carpeta nginx en la raíz del proyecto con el archivo `nginx/default.conf`:
    ```nginx
    # 1. Servidor para la Aplicación Principal (Frontend y Backend API)
    server {
        listen 80;
        server_name boilerplate.test;

        # Enrutamiento al Frontend (Vue 3 / Vite)
        location / {
            proxy_pass http://frontend:5173;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }

        # Enrutamiento al Backend (Express API)
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # 2. Servidor para la Documentación (VitePress)
    server {
        listen 80;
        server_name docs.boilerplate.test;

        location / {
            proxy_pass http://boilerplate_docs:5173;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
## Paso 5: Orquestación de Infraestructura Local con `docker-compose.yml`
+ Crea el archivo `docker-compose.yml` en la raíz del proyecto:
```yaml
services:
  # Nginx Gateway
  proxy:
    image: nginx:alpine
    container_name: boilerplate_proxy
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend
      - docs
    networks:
      - app-network

  # Base de Datos PostgreSQL
  postgres_dev:
    image: postgres:15-alpine
    container_name: boilerplate_postgres
    restart: always
    environment:
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: boilerplate_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev_user -d boilerplate_db"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # MinIO (S3 Local)
  minio:
    image: minio/minio:RELEASE.2024-01-18T22-51-28Z
    container_name: boilerplate_minio
    restart: always
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minio_admin
      MINIO_ROOT_PASSWORD: minio_password123
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    networks:
      - app-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: boilerplate_backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - APP_URL=http://boilerplate.test
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      postgres_dev:
        condition: service_healthy
      minio:
        condition: service_started
    command: npm run dev
    networks:
      - app-network

  # Frontend SPA
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: boilerplate_frontend
    restart: always
    environment:
      - VITE_API_URL=http://boilerplate.test/api
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - backend
    networks:
      - app-network

  prisma-studio:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: boilerplate_prisma_studio
    restart: always
    ports:
      - "5555:5555"
    environment:
      - DATABASE_URL=postgresql://dev_user:dev_password@postgres_dev:5432/boilerplate_db
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      postgres_dev:
        condition: service_healthy
    command: npx prisma studio --port 5555 --browser none
    networks:
      - app-network

  # Documentación (VitePress)
  docs:
    image: node:18-alpine
    container_name: boilerplate_docs
    restart: always
    working_dir: /usr/src/app
    ports:
      - "8080:5173"
    volumes:
      - ./docs:/usr/src/app
      - /usr/src/app/node_modules
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
  minio_data:
```
## Paso 6: Ajustar `.env` en el Backend
  + Actualiza tu archivo `backend/.env` para usar el nombre del contenedor de la base de datos:
      ```ini
      # ==========================================
      # CONFIGURACIÓN DEL SERVIDOR BACKEND LOCAL
      # ==========================================
      PORT=3000
      APP_URL=http://boilerplate.test
      NODE_ENV=development

      # ==========================================
      # CONFIGURACIÓN DEL SERVIDOR DE BASE DE DATOS LOCAL
      # ==========================================        
      DATABASE_URL="postgresql://dev_user:dev_password@postgres_dev:5432/boilerplate_db"
      DIRECT_URL="postgresql://dev_user:dev_password@postgres_dev:5432/boilerplate_db"

      # ==========================================
      # CONFIGURACIÓN DEL BUCKET DE ALMACENAMIENTO DE ARCHIVOS LOCAL
      # ==========================================
      S3_ENDPOINT="http://minio:9000"
      ```
## Paso 7: Comandos de Ejecución
  + Levantar todo el entorno:
      ```bash
      # Levantar todos los servicios
      docker compose up -d --build

      # Levantar solo un servicio, por ejemplo el backend o el frontend
      docker compose up -d --build backend
      docker compose up -d --build frontend
      ```
  + Verificar acceso:
      + Frontend: `http://boilerplate.test`
      + API Health Check: `http://boilerplate.test/api/health`
      + MinIO Console: `http://localhost:9001`
      + Prisma Studio: `http://localhost:5555`
  + Ver logs del sistema:
      ```bash
      docker compose logs -f backend
      docker compose logs -f frontend
      docker compose logs minio
      ```
  + Comandos de interes
      ```bash
      # Ejecutar migraciones o comandos de Prisma dentro del contenedor
      docker compose exec backend npx prisma migrate dev

      # Estado de los contenedores
      docker compose ps
      ```