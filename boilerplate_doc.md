# Bolierplate Node.js | Vue.js 2026

## Incepción del Proyecto

### 📑 Especificación de Arquitectura e Infraestructura de Software
1. **Resumen Ejecutivo**
El presente documento describe la arquitectura de software, stack tecnológico e infraestructura cloud elegida para el desarrollo del **Starter Kit / Boilerplate Web**. El objetivo principal es construir una plataforma moderna, escalable, segura y desacoplada, utilizando una arquitectura de `microservicios/decoupled` de capa gratuita (Free Tier Operations), garantizando costo $0.00 USD de mantenimiento operativo sin comprometer los estándares de la industria.

2. **Visión General de la Infraestructura y Componentes**:
    + La solución adopta una **Arquitectura Desacoplada (Decoupled Frontend / Backend Architecture)**. El sistema se divide en cuatro pilares independientes:

    ```
    [ Capa de Presentación ]       [ Capa de Aplicación / API ]      [ Capa de Persistencia y Archivos ]
    ┌─────────────────────────┐     ┌───────────────────────────┐     ┌─────────────────────────────────┐
    │     Frontend (SPA)      │     │      Backend (REST API)   │     │    Relational DB & S3 Storage   │
    │  Vue 3 + Vite + Pinia   │ ──> │   Node.js + Express +     │ ──> │  PostgreSQL + Cloud Storage     │
    │                         │     │        Prisma ORM         │     │            (Supabase)           │
    └─────────────────────────┘     └───────────────────────────┘     └─────────────────────────────────┘
                │                                │                                    │
                ▼                                ▼                                    ▼
        Hosted en Vercel                Hosted en Render.com               Hosted en Supabase Cloud
    ```

3. **Matriz de Componentes Tecnológicos y Justificación**
    1. **Capa de Presentación (Frontend)**
        + Tecnología Core: Vue.js 3 (Composition API / `<script setup>`) + Vite.
        + Gestión de Estado: Pinia.
        + Enrutamiento: Vue Router (con Navigation Guards para RBAC).
        + Infraestructura de Despliegue: Vercel / Netlify.
        + ¿Por qué esta elección?:
            + Rendimiento y Ligereza: Vite ofrece tiempos de compilación e instanciación (HMR) en milisegundos.
            + SPA Pura: Al ser un renderizado del lado del cliente (CSR), la web se puede hospedar de forma estática en CDNs globales de Vercel/Netlify de forma totalmente gratuita y ultrarrápida.
            + Seguridad y Mantenibilidad: La aplicación frontend no maneja lógica sensible de negocio ni almacenamiento directo de credenciales de BD.
    2. **Capa de Negocio / API (Backend)**
        + Tecnología Core: Node.js + Express.js.
        + Capa de Abstracción de Datos (ORM): Prisma ORM.
        + Mecanismo de Autenticación: JSON Web Tokens (JWT) + Hashing seguro de contraseñas (bcrypt / argon2).
        + Infraestructura de Despliegue: Render.com (Web Service).
        + ¿Por qué esta elección?:
            + Desacoplamiento Operativo: Al exponer una API REST pura (/api/v1/...), el backend es agnóstico del cliente. En el futuro, aplicaciones móviles (iOS/Android) o clientes de terceros podrán consumir la misma API sin cambios.
            + Seguridad Absoluta: Las claves de entorno (DATABASE_URL, JWT_SECRET) residen exclusivamente dentro de los contenedores aislados de Render.
            + Prisma ORM: Aporta un tipado estricto, previene ataques de Inyección SQL (SQLi) y permite gestionar migraciones de esquemas de base de datos de manera automatizada y declarativa.
    3. **Capa de Persistencia de Datos y Archivos**
        + Motor de Base de Datos: PostgreSQL.
        + Gestión de Archivos (Object Storage): Supabase Storage (Compatible con AWS S3).
        + Proveedor de Infraestructura: Supabase Cloud.
        + ¿Por qué esta elección?:
            + Integridad Referencial (SQL vs NoSQL): Para la gestión de Usuarios, Roles (RBAC) y Permisos, el modelo relacional SQL es superior a NoSQL. Permite aplicar restricciones de clave foránea (Foreign Keys), transacciones ACID y relaciones N:M (Muchos a Muchos) nativas.
            + Consolidación de Servicios: Supabase resuelve en una sola plataforma gratuita la base de datos relacional (PostgreSQL) y el almacenamiento masivo de imágenes/PDFs (Bucket S3), simplificando la gestión de tokens de API y facturación.

4. **Control de Acceso Basado en Roles (RBAC - Security Model)**
+ La arquitectura implementa un modelo de seguridad en dos niveles:
    1. Nivel Backend (Autorización Firme): Middlewares interceptores de peticiones (authorize(['ADMIN', 'SUPER_ADMIN'])). Si el token JWT presentado no contiene el privilegio requerido en el backend, la API responderá con un estado HTTP 403 Forbidden inmediatamente, protegiendo los datos.
    2. Nivel Frontend (UX / Navegación): El router de Vue.js utiliza Guards para evaluar el estado del usuario en Pinia. Si un usuario sin privilegios intenta acceder a una ruta administrativa (ej. /admin), es redirigido automáticamente a la vista de acceso denegado o login.

5. **Estrategia de Costos e Infraestructura ($0 USD)**
    Servicio            | Proveedor         | Recurso Gratis Asignado               | Límite de Seguridad
    --------------------|-------------------|---------------------------------------|---------------------------------------------------------------
    Frontend            | Vercel / Netlify  | 100 GB / mes de Ancho de Banda        | Sin cobros automáticos (se suspende el servicio si se excede).
    Backend             | APIRender.com     | 750 horas / mes de ejecución Linux    | Se duerme tras inactividad. Sin cobros automáticos.
    Base de Datos       | Supabase          | 500 MB PostgreSQL dedicado            | No requiere tarjeta de crédito.
    Archivos (PDF/Img)  | Supabase Storage  | 1 GB de Almacenamiento S3             | Totalmente aislado de la BD principal.


### 📖 Configuración de Base de Datos y Almacenamiento
Esta sección detalla el proceso paso a paso para desplegar la capa de datos en la nube (Supabase) y preparar el entorno de desarrollo local.

#### 🛠️ PARTE 1: Creación del Proyecto en Supabase (Producción / Cloud)

##### Paso 1: Registro e Inicio de Sesión
1. Dirígete a [supabase.com](https://supabase.com).
2. Haz clic en "Start your project" / "Sign In".
3. Selecciona la opción "Continue with GitHub" para autenticarte usando tu cuenta de GitHub (esto evita crear contraseñas adicionales y facilitará futuras integraciones).

##### Paso 2: Crear una Nueva Organización y Proyecto
1. En el panel principal (Dashboard), haz clic en el botón "New Project".
2. Si es tu primera vez, te pedirá seleccionar una Organization (puedes crear una con tu nombre o el nombre del proyecto).
3. Completa el formulario de creación con los siguientes datos:
    + Name: `starter-kit-db` (o el nombre de tu proyecto: `boilerplate`).
    + Database Password: ⚠️ ¡Mucha atención aquí! Genera una contraseña segura y guárdala en un lugar seguro (un gestor de contraseñas). La necesitarás para construir la URL de conexión.
    + Region: Selecciona la región geográfica más cercana a ti o a tus usuarios principales (por ejemplo, West Europe / Frankfurt o US East / N. Virginia).
    + Pricing Plan: Asegúrate de seleccionar Free - $0/month.
4. Haz clic en "Create new project".
    + ⏳ Nota: Supabase tardará entre 1 y 2 minutos en aprovisionar la base de datos PostgreSQL en la nube.

##### Paso 3: Obtener las Credenciales de la Base de Datos (PostgreSQL)
Para que nuestro Backend en Node.js (vía Prisma ORM) se conecte a la base de datos, necesitamos el Connection String (Cadena de conexión).
1. En el menú lateral izquierdo de Supabase, ve a Project Settings (el icono de engranaje ⚙️ en la parte inferior).
2. Selecciona la sección Database.
3. Desplázate hasta la sección Connection string.
4. Selecciona la pestaña URI o Transaction pooler (para Prisma se recomienda la pestaña URI o utilizar el puerto 6543 / 5432 según el modo).
5. Copia la cadena que tiene una estructura similar a esta:
    ```
    postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres
    ```
6. Reemplaza [YOUR-PASSWORD] en la cadena por la contraseña real que creaste en el Paso 2

##### Paso 4: Crear el Bucket de Almacenamiento para Archivos (Storage)
Para guardar las imágenes de perfil, PDFs y documentos sin recargar la base de datos:
1. En el menú lateral izquierdo de Supabase, haz clic en el icono de Storage (🗂️).
2. Haz clic en el botón "Create a new bucket".
3. Configura el bucket con los siguientes parámetros:
    + Bucket Name: app-uploads
    + Public bucket: ACTIVADO 🟢 (esto permitirá que las imágenes y PDFs sean accesibles mediante una URL pública https://... desde el navegador).
4. Haz clic en "Save".
5. Ve a Project Settings ⚙️ -> API y copia las siguientes claves necesarias para subir archivos desde la API:
    + Project URL: [https://xxxxxx.supabase.co](https://xxxxxx.supabase.co)
    + anon / public key: eyJhbGciOiJKV1QiLC... (Clave pública)
    + service_role key: eyJhbGciOiJKV1QiLC... (Clave privada para el backend - ¡mantener secreta!).


## 📑 Instalación de Node.js mediante NVM en WSL (Ubuntu)
Esta sección registra la preparación del entorno de ejecución de Node.js en el subsistema Linux (WSL) utilizando NVM para gestionar versiones de forma aislada y sin permisos de superusuario (root).

### 🛠️ Paso 1: Instalar NVM (Node Version Manager)
+ Ejecuta el script oficial de instalación de NVM en tu terminal de WSL:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
+ Una vez finalizada la descarga, recarga la configuración de tu terminal para activar nvm:
    ```bash
    source ~/.bashrc
    ```

### 🛠️ Paso 2: Instalar la versión estable de Node.js (LTS)
+ Con NVM activo, instala la última versión con soporte extendido (LTS) de `Node.js` y `npm`:
    ```bash
    nvm install --lts
    ```
+ NVM la configurará automáticamente como la versión por defecto de tu sistema.

### 🛠️ Paso 3: Verificar la Instalación
+ Comprueba que tanto `node` como `npm` están disponibles en tu terminal:
    ```bash
    node -v
    npm -v
    ```


## 📄 Estructuración Local y Control de Versiones (Git & GitHub)
Esta sección documenta el procedimiento estándar para organizar el espacio de trabajo local, levantar la infraestructura de desarrollo mediante Docker y vincular los proyectos con repositorios remotos en GitHub.

### 🏗️ PARTE 1: Organización del Espacio de Trabajo (Mono-Repo)
A diferencia de un monolito, la arquitectura desacoplada requiere separar el código fuente de la infraestructura y de los diferentes clientes.

+ **Estructura de Directorios**
    ```txt
    boilerplate-node-2026/
    ├── backend/            # App Node.js
    │   ├── Dockerfile
    │   └── package.json
    ├── frontend/           # App Vue.js
    │   ├── Dockerfile
    │   └── package.json
    ├── .env.example        # Variables de entorno globales
    ├── .gitignore
    ├── docker-compose.yml  # Orquestador principal
    └── README.md           # Instrucciones de setup inicial
    ```

### 🚀 PARTE 2: Creación de la Estructura e Infraestructura Local

#### Paso 1: Crear la Jerarquía de Directorios
+ Ejecuta los siguientes comandos en tu terminal para inicializar el espacio de trabajo:
    ```bash
    # 1. Asegúrate de estar en tu directorio de proyectos en Linux
    cd ~/projects

    # 2. Crea la carpeta utilizando la sintaxis estándar de Linux
    mkdir boilerplate-node-2026

    # 3. Entra a la carpeta
    cd boilerplate-node-2026
    ```

#### Paso 2: Crear estructura del Backend Inicial
1. Inicialización del Proyecto e Instalación de Dependencias:
    + Ubicados en la carpeta `backend`, inicializamos el paquete de Node.js e instalamos el conjunto de librerías necesarias:
        ```bash
        # 1. Navegar al directorio del backend
        cd ~/projects/boilerplate-node-2026

        # 2. Crear el directorio para el Backend y entrar en el
        mkdir backend
        cd backend

        # 2. Inicializar package.json
        npm init -y

        # 3. Instalar dependencias de producción
        npm install express @prisma/client @prisma/adapter-pg pg bcryptjs jsonwebtoken dotenv cors multer @aws-sdk/client-s3 express-validator

        # 4. Instalar dependencias de desarrollo
        npm install -D prisma nodemon @faker-js/faker
        ```
    + Desglose de Paquetes Instalados
        Paquete                 | Tipo          | Propósito
        ------------------------|---------------|---------------------------------------------------------------------------------------
        express	                | Producción    | Framework HTTP para crear la API REST y gestionar rutas/middlewares.
        @prisma/client	        | Producción    | ORM autocompletado para realizar consultas a la base de datos.
        @prisma/adapter-pg	    | Producción    | Adaptador de base de datos para conectar Prisma 7 con el cliente de PostgreSQL.
        pg	                    | Producción    | Controlador nativo de PostgreSQL para Node.js requerido por el adaptador de Prisma.
        bcryptjs	            | Producción    | Hashing unidireccional de contraseñas de usuarios antes de persistirlas.
        jsonwebtoken	        | Producción    | Generación y verificación de tokens de sesión firmados (JWT).
        dotenv	                | Producción    | Carga variables de entorno desde el archivo .env hacia process.env.
        cors	                | Producción    | Middleware para permitir peticiones HTTP entre el backend y el cliente frontend.
        multer	                | Producción    | Middleware para procesar peticiones multipart/form-data y gestionar carga de archivos.
        @aws-sdk/client-s3	    | Producción    | SDK de AWS para operaciones de almacenamiento S3 (MinIO en local, AWS S3, Cloudflare R2).
        express-validator	    | Producción    | Sanitización y validación de datos de entrada en las peticiones HTTP (email, password, etc.).
        prisma	                | Desarrollo    | CLI de Prisma para ejecutar migraciones, inspeccionar esquemas y generar el cliente.
        nodemon	                | Desarrollo    | Reinicio automático del servidor Node.js ante cambios de código en desarrollo.
        @faker-js/faker	        | Desarrollo    | Generación de datos de prueba (seeders/factories) para poblar la base de datos.
2. Limpiar vulnerabilidades:
    ```bash
    # 1. Reparación automática de NPM | Este comando actualizará las sub-dependencias que tengan vulnerabilidades a versiones parcheadas seguras sin realizar cambios disruptivos (non-breaking).
    npm audit fix

    # 2. Verificar el estado del auditor
    npm audit

    # 3. Limpiar el aviso de allow-scripts (Opcional)
    npm approve-scripts --allow-scripts-pending
    ```
3. Fijar versiones estables LTS
    ```bash
    # 1. Instalar la versión estable más reciente de Prisma y su cliente (v6.x o v7.x estable)
    npm install @prisma/client@latest
    npm install -D prisma@latest

    # 2. Reconstruir el lockfile de forma limpia
    rm -rf node_modules package-lock.json
    npm install

    # 3. Verificación Final y Limpieza
    npm audit
    ```
4. Crear y configurar `nodemon.json` en la raíz de `backend/` (`backend/nodemon.json`):
    ```json
    {
        "watch": ["src"],
        "ext": "js,json",
        "ignore": [
            "uploads/*",
            "prisma/*",
            ".env",
            "node_modules/*"
        ]
    }    
    ```
5. Actualizar `backend/package.json`
    ```json
    {
        "name": "backend",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "start": "node src/server.js",
            "start:prod": "npx prisma migrate deploy && node src/server.js",
            "dev": "nodemon src/server.js",
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "type": "commonjs",
        "dependencies": {
            "@aws-sdk/client-s3": "^3.1127.0",
            "@prisma/adapter-pg": "6.4.0",
            "@prisma/client": "6.4.0",
            "@supabase/supabase-js": "^2.115.0",
            "bcryptjs": "^3.0.3",
            "cors": "^2.8.6",
            "dotenv": "^17.4.2",
            "express": "^4.21.2",
            "express-validator": "^7.3.2",
            "jsonwebtoken": "^9.0.3",
            "multer": "^2.3.0",
            "pg": "^8.23.0"
        },
        "devDependencies": {
            "@faker-js/faker": "^10.6.0",
            "nodemon": "^3.1.14",
            "prisma": "6.4.0"
        }
    }
    ```
    + Ejecutar:
        ```bash
        rm -rf node_modules package-lock.json
        npm install
        npm audit
        npm audit fix
        npm approve-scripts @prisma/client prisma @prisma/engines esbuild
        ```
6. Ejecutar la inicialización de Prisma
    ```bash
    npx prisma init
    ```
    + Esto creará la carpeta `prisma/` con schema.prisma y el archivo `.env`.
7. Añadir un modelo básico o de prueba en `backend/prisma/schema.prisma`:
    ```prisma
    generator client {
        provider = "prisma-client-js"
    }

    datasource db {
        provider  = "postgresql" // O el motor que estés usando (mysql, sqlite, etc.)
        url       = env("DATABASE_URL")
        directUrl = env("DIRECT_URL")
    }

    // Añade este modelo de prueba para que 'prisma generate' funcione
    model User {
        id        Int      @id @default(autoincrement())
        email     String   @unique
        createdAt DateTime @default(now())
    }
    ```
    + Ejecuta:
        ```bash
        npx prisma migrate dev --name init
        ```
8. Crear archivo de variables de entorno `backend/.env`:
    ```env
    # ==========================================
    # CONFIGURACIÓN DEL SERVIDOR BACKEND LOCAL
    # ==========================================
    PORT=3000
    APP_URL=http://localhost:3000
    NODE_ENV=development

    # ==========================================
    # CONFIGURACIÓN DEL SERVIDOR DE BASE DE DATOS LOCAL
    # ==========================================
    DATABASE_URL="postgresql://dev_user:dev_password@postgres_dev:5432/boilerplate_db"
    DIRECT_URL="postgresql://dev_user:dev_password@postgres_dev:5432/boilerplate_db"
    ```
9.  Crear `backend/.gitignore`:
    ```gitignore
    node_modules/
    .env
    .env.*
    !.env.example
    npm-debug.log*
    *.log
    dist/
    build/
    ```
10. Crea el archivo `backend/src/server.js`:
    ```js
    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');

    const app = express();
    const PORT = process.env.PORT || 3000;
    const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

    app.use(cors());
    app.use(express.json());

    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
    });

    const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en ${APP_URL}`);
    });

    // Cierre limpio del servidor para liberar el puerto
    const gracefulShutdown = (signal) => {
        console.log(`\nRecibida señal ${signal}. Cerrando servidor limpiamente...`);
        server.close(() => {
            console.log('Servidor Express cerrado. Puerto liberado.');
            process.exit(0);
        });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    ```
11. Prueba la ejecución:
    ```
    npm run dev
    ```
    + En caso de necesitar matar el proceso:
        ```bash
        npx kill-port 3000
        ```
    + Verifica el endpoint:
        ```bash
        curl http://localhost:3000/api/health
        ```

#### Paso 3: Crear estructura del Frontend Inicial
+ Esta fase cubre la construcción del cliente SPA dentro de la carpeta `frontend` utilizando Vue 3 (Composition API / `<script setup>`), Vite, Pinia, Vue Router y Axios, con Tailwind CSS v4 para los estilos.
1. Creación del Proyecto Vue 3 con Vite
    + Antes de instalar paquetes de terceros, generamos la estructura oficial de Vue 3 dentro de la carpeta del frontend:
        ```bash
        # Ubicarse en la raíz del proyecto
        cd ~/projects/boilerplate-node-2026

        # Crear el proyecto Vue 3
        npm create vue@latest frontend
        ```
    + Opciones durante la creación del CLI de Vue:
        + Project name: frontend
        + Add TypeScript? No
        + Add JSX Support? No
        + Add Vue Router for Single Page Application development? Yes (Opción recomendada)
        + Add Pinia for state management? Yes (Opción recomendada)
        + Add Vitest for Unit Testing? No
        + Add an End-to-End Testing Solution? No
        + Add ESLint for code quality? Yes

2. Corregir las versiones en tu entorno local (evitar `--legacy-peer-deps`)
    ```bash
    cd frontend
    npm install eslint-plugin-oxlint@latest oxlint@latest --save-dev
    ```
3. Editar `frontend/vite.config.js`:
    ```js
    // ...
    export default defineConfig({
        // ...
        server: {
            host: true,
            allowedHosts: [
                'boilerplate.test',
                '.test' // O usa true para permitir cualquier dominio local
            ]
        }  
    })    
    ```
4. Una vez creado, navegamos al directorio e instalamos las dependencias base generadas por Vue:
    ```bash    
    npm install
    ```
    + En caso de error, ejecutar:
    ```bash
    npm install --legacy-peer-deps
    ```
5. Prueba la ejecución:
    ```
    npm run dev
    ```

### 📑 PARTE 3: Git y GitHub

#### Iniciar repositorio Git y subir a GitHub
```bash
# 3. Entra a la carpeta
cd boilerplate-node-2026

# 4. Inicializa el repositorio Git de una vez
git init

# 5. Abre VS Code directamente en WSL (si usas VS Code)
code .
```

#### Subir proyecto a GitHub CLI
```bash
# 1. Instalar dependencias previas
sudo apt update && sudo apt install -y curl wget gpg

# 2. Agregar la clave GPG y el repositorio oficial de GitHub CLI
mkdir -p -m 755 /etc/apt/keyrings
wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
sudo chmod 644 /etc/apt/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# 3. Actualizar e instalar 'gh'
sudo apt update
sudo apt install -y gh

# 4. Paso único de autenticación (Solo la primera vez)
gh auth login


# 5. Asegúrate de estar dentro de la carpeta raíz de tu proyecto
cd ~/projects/boilerplate-node-2026

# 6. Crea un README inicial y un .gitignore básico
echo "# Boilerplate Node 2026" > README.md
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# 7. Guarda tu primer commit
git add .
git commit -m "chore: initial commit"

# 8. Crea el repositorio público (o privado) y súbelo de una vez
gh repo create boilerplate-node-2026 --public --source=. --remote=origin --push
```

## 📄 Dockerización
1. Mapear el dominio local en tu Sistema Operativo:
    + Abre el archivo hosts de tu sistema con permisos de administrador:
        + Windows (WSL): `C:\Windows\System32\drivers\etc\hosts`.
        + Linux/WSL: `/etc/hosts`.
    + Agrega esta línea al final:
        ```
        127.0.0.1   boilerplate.test
        ```
2. Dockerización del Backend:
    + Crea `backend/.dockerignore`:
        ```dockerignore
        node_modules
        npm-debug.log
        .env
        .git
        .gitignore
        README.md
        dist        
        ```
    + Crea `backend/Dockerfile`:
        ```Dockerfile
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
3. Dockerización del Frontend:
    + Crea `frontend/.dockerignore`:
        ```dockerignore
        node_modules
        dist
        .git
        .gitignore
        README.md
        ```
    + Crea `frontend/Dockerfile`:
        ```Dockerfile
        FROM node:20-alpine

        WORKDIR /usr/src/app

        COPY package*.json ./

        RUN npm ci

        COPY . .

        EXPOSE 5173

        CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
        ```
4. Configurar Nginx Reverse Proxy:
    + Crea una carpeta nginx en la raíz del proyecto con el archivo `nginx/default.conf`:
        ```conf
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
        ```
5. Orquestación de Infraestructura Local con `docker-compose.yml`
+ Crea el archivo `docker-compose.yml` en la raíz del proyecto:
```yml
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

volumes:
  postgres_data:
  minio_data:
```
6. Ajustar `.env` en el Backend:
    + Actualiza tu archivo `backend/.env` para usar el nombre del contenedor de la base de datos:
        ```env
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
7. Comandos de Ejecución:
    + Levantar todo el entorno:
        ```bash
        # Levantar todos los servicios
        docker compose up -d --build

        # Levantar solo un servicio, por ejemplo el backend o el frontend
        docker compose up -d --build backend
        docker compose up -d --build frontend
        ```
    + Verificar acceso:
        + Frontend: [http://boilerplate.test](http://boilerplate.test)
        + API Health Check: [http://boilerplate.test/api/health](http://boilerplate.test/api/health)
        + MinIO Console: [http://localhost:9001](http://localhost:9001)
        + Prisma Studio: [http://localhost:5555](http://localhost:5555)
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

## 📄 Despliegue en Producción (CI/CD $0 USD)

### Persistencia de Datos (Supabase PostgreSQL)
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

### Ejecutar seeder en producción (Supabase)
1. Abre la terminal en la carpeta de tu `backend`.
2. Ejecuta el comando de seed pasando la cadena de conexión de producción de Supabase:
    ```bash
    DATABASE_URL="postgres://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:<PORT>/<DATABASE_NAME>" npx prisma db seed
    DATABASE_URL="postgres://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:<PORT>/<DATABASE_NAME>" node src/seeders/superadmin.seeder.js
    ```
    + Asegúrate de reemplazar las credenciales por las reales de Supabase, tal como hiciste al aplicar las migraciones.

### API Backend (Render Web Service)
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
        + PORT: 10000
        + APP_URL: "https://boilerplate-node.onrender.com"
        + NODE_ENV: production
        + DATABASE_URL: "postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:6543/<DATABASE_NAME>?pgbouncer=true"
        + DIRECT_URL: "postgresql://<USER>.<PROJECT_REF>:<ENCODED_PASSWORD>@<POOLER_HOST>:5432/<DATABASE_NAME>"
    + Haz clic en `Deploy Web Service`.
    + Copia la URL pública generada (ej. [https://boilerplate-node-2026.onrender.com](https://boilerplate-node-2026.onrender.com)).
3. Prueba de funcionamiento:
    + Verifica el endpoint:
        ```bash
        curl https://boilerplate-node-2026.onrender.com/api/health
        ```

### Configuración de Enrutamiento SPA en Vercel
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

### Capa de Presentación (Vercel)
1. Creación de Cuenta:
    + Accede a vercel.com mediante Continue with GitHub.
    + En el onboarding, selecciona "I'm working on personal projects" para habilitar el plan Hobby 100% gratuito (sin tarjeta).
    + En el aviso de seguridad 2FA, selecciona "Skip securing my account".
    + Haz clic en Add New... > Project e importa `boilerplate-node-2026`.
    + 
2. Importación y Despliegue del Frontend:
    + En el Dashboard, haz clic en Add New... > Project.
    + Importa el repositorio del frontend (`boilerplate-node-2026`).
    + Root Directory: `frontend`.
3. Ajustes de Build & Runtime (En caso de ser necesario):
    + En Settings > Build and Deployment:
        + Node.js Version: 20.x
        + Install Command (Override): npm install --legacy-peer-deps (evita errores ERESOLVE por peer dependencies de paquetes como oxlint).
4. Variables de Entorno en Vercel:
    + En Settings > Environment Variables:
        + Key: VITE_API_BASE_URL
        + Value: "https://boilerplate-node-2026.onrender.com/api/v1"
5. Despliegue Final:
    + Haz clic en Deploy. Tras guardar o cambiar variables de entorno, ejecuta siempre un Redeploy (sin usar Build Cache) para inyectar la URL de la API en los archivos estáticos de React/Vite.


## 📄 Variables de entorno
### Backend
1. Variables de Entorno del Backend (`backend/.env`):
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
    S3_PUBLIC_URL="http://minio:9000/app-uploads"
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
    # - - - LOCAL Y PRODUCCIÓN - - -
    # ==========================================
    FRONTEND_URL_PROD=https://tu-proyecto.vercel.app
    FRONTEND_URL_LOCAL_VITE=http://localhost:5173
    FRONTEND_URL_LOCAL_VUE_CLI=http://localhost:8080
    ```
2. Actualizar variables de entorno en `https://render.com`.

### Frontend
1. Variables de Entorno del Frontend (`frontend/.env`):
    ```env
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
    # ==========================================
    # - - - PRODUCCIÓN - - -
    # ==========================================
    # VITE_API_BASE_URL=https://tu-proyecto.onrender.com/api/v1
    ```
2. Actualizar variables de entorno en `https://vercel.com`.



## ⚙️ Desarrollo del Backend
### 🗄️ Paso 1: Configuración de Base de Datos y ORM (Prisma)
1. Configuración del `Archivo de Modelo de Datos` de Prisma: actualizar (reemplazar) el archivo `backend/prisma/schema.prisma`:
    ```prisma
    // This is your Prisma schema file,
    // learn more about it in the docs: https://pris.ly/d/prisma-schema

    // Get a free hosted Postgres database in seconds: `npx create-db`

    generator client {
        provider        = "prisma-client-js"
        previewFeatures = ["driverAdapters"]
    }

    datasource db {
        provider  = "postgresql"
        url       = env("DATABASE_URL")
        directUrl = env("DIRECT_URL")
    }

    // Modelo de Usuario
    model User {
        id        String     @id @default(uuid())
        name      String
        email     String     @unique
        password  String
        isActive  Boolean    @default(true)
        avatarUrl String?
        createdAt DateTime   @default(now())
        updatedAt DateTime   @updatedAt
        roles     UserRole[]
        auditLogs AuditLog[]

        @@map("users")
    }

    // Modelo de Rol
    model Role {
        id          String           @id @default(uuid())
        name        String           @unique
        description String?
        createdAt   DateTime         @default(now())
        updatedAt   DateTime         @default(now()) @updatedAt
        users       UserRole[]
        permissions RolePermission[]

        @@map("roles")
    }

    // Modelo de Permission
    model Permission {
        id          String           @id @default(uuid())
        action      String           @unique // Ej: "users:read", "users:write"
        module      String // Ej: "users", "roles", "system"
        description String?
        createdAt   DateTime         @default(now())
        roles       RolePermission[]

        @@map("permissions")
    }

    // Tabla Pivote: Relación M:N entre Role y Permission
    model RolePermission {
        roleId       String
        permissionId String
        assignedAt   DateTime   @default(now())
        role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
        permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

        @@id([roleId, permissionId])
        @@map("role_permissions")
    }

    // Tabla Intermedia para Relación N:M
    model UserRole {
        userId     String
        roleId     String
        assignedAt DateTime @default(now())
        user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
        role       Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)

        @@id([userId, roleId])
        @@map("user_roles")
    }

    // Auditoría y Logs
    model AuditLog {
        id     String  @id @default(uuid())
        userId String? // Opcional por si la acción la ejecuta un usuario no autenticado o el sistema
        user   User?   @relation(fields: [userId], references: [id], onDelete: SetNull)

        action   String // Ejemplos: 'USER_CREATED', 'ROLE_UPDATED', 'PERSON_DELETED'
        entity   String // La entidad afectada: 'User', 'Person', 'Tree', 'Auth'
        entityId String? // ID del registro afectado (si aplica)

        details   Json? // Información extra (ej. cambios anteriores y nuevos, IP, User-Agent)
        ipAddress String?

        createdAt DateTime @default(now())

        @@index([userId])
        @@index([action])
        @@index([entity])
        @@index([createdAt])
    }

    // Modelo SystemLog
    model SystemLog {
        id         String   @id @default(uuid())
        level      String   @default("ERROR") // ERROR, WARN, INFO
        message    String
        stackTrace String?  @db.Text
        path       String?
        method     String?
        statusCode Int?     @default(500)
        userId     String?
        createdAt  DateTime @default(now())

        @@map("system_logs")
    }   
    ```
    + Define los modelos (Usuarios, Roles, Auditorías, etc.) y la conexión a PostgreSQL.
2. Crear el Orquestador Principal de Seeders `backend/prisma/seed.js`:
    ```js
    // backend/prisma/seed.js
    const prisma = require('../src/config/prisma');
    const seedRolesAndPermissions = require('../src/seeders/role-permission.seeder');
    const seedSuperAdmin = require('../src/seeders/superadmin.seeder');

    async function main() {
        console.log('🚀 === INICIANDO EJECUCIÓN DE SEEDERS ===\n');
        
        // 1. Ejecutar catálogo RBAC
        await seedRolesAndPermissions();
        console.log('----------------------------------------');
        
        // 2. Ejecutar SuperAdmin
        await seedSuperAdmin();
        console.log('----------------------------------------');
        
        console.log('\n✨ === SEEDERS EJECUTADOS CON ÉXITO ===');
    }

    main()
        .catch((e) => {
            console.error('❌ Error fatal durante el proceso de seed:', e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });   
    ```

### 🛠️ Paso 2: Clientes de Servicios y Unidades de Configuración (`src/config/`)
+ Crear la carpeta `backend/src/config/` e inicializa los clientes de integración:
1. `backend/src/config/prisma.js`: Instancia singleton de @prisma/client para ser reutilizada en la aplicación.
    ```js
    const { PrismaClient } = require('@prisma/client');
    const { PrismaPg } = require('@prisma/adapter-pg');
    const { Pool } = require('pg');
    const { auditStorage } = require('../middlewares/auditContext.middleware');
    require('dotenv').config();

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prismaRaw = new PrismaClient({ adapter });

    const prisma = prismaRaw.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    const result = await query(args);

                    const writeOperations = ['create', 'update', 'delete', 'updateMany', 'deleteMany'];
                    const ignoredModels = ['AuditLog', 'SystemLog', 'system_logs', 'audit_logs'];

                    // Evitar auditar acciones sobre las tablas del sistema / logs
                    if (writeOperations.includes(operation) && !ignoredModels.includes(model)) {
                        try {
                            const store = auditStorage.getStore();
                            const userId = store?.userId || null;
                            const ipAddress = store?.ipAddress || '127.0.0.1';

                            const sanitizedDetails = args?.data ? { ...args.data } : {};
                            if (sanitizedDetails.password) {
                                sanitizedDetails.password = '[PROTECTED]';
                            }

                            const auditData = {
                                action: `${operation.toUpperCase()}_${model.toUpperCase()}`,
                                entity: model,
                                entityId: result?.id ? String(result.id) : (args?.where?.id ? String(args.where.id) : 'N/A'),
                                ipAddress,
                                details: JSON.stringify(sanitizedDetails),
                            };

                            if (userId) {
                                auditData.user = { connect: { id: userId } };
                            }

                            await prismaRaw.auditLog.create({
                                data: auditData,
                            });
                        } catch (error) {
                            console.error('Error registrando auditoría en Prisma Extension:', error);
                        }
                    }

                    return result;
                },
            },
        },
    });

    module.exports = prisma;
    module.exports.prismaRaw = prismaRaw;    
    ```
2. `backend/src/config/s3.js`: Cliente para AWS S3 / MinIO:
    ```js
    const { S3Client, HeadBucketCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
    require('dotenv').config();

    const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';

    const s3Client = new S3Client({
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        forcePathStyle: forcePathStyle,
    });

    /**
    * Verifica si el bucket existe en S3/MinIO y lo crea si no existe
    */
    const ensureBucketExists = async (bucketName) => {
        try {
            await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        } catch (error) {
            // Si el bucket no existe (error 404 o NotFound), lo creamos
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                console.log(`📦 El bucket '${bucketName}' no existe. Creándolo automáticamente...`);
                await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
                console.log(`✅ Bucket '${bucketName}' creado con éxito.`);
            } else {
                throw error;
            }
        }
    };

    module.exports = { s3Client, ensureBucketExists };        
    ```

### 🧰 Paso 3: Utilidades Genéricas (`src/utils/`)
+ Crea los helpers universales necesarios para controladores y middlewares:
1. `backend/src/utils/request.utils.js`: Helpers para formatear respuestas HTTP estándar (successResponse, errorResponse, etc.) o parsear la IP/User-Agent del cliente:
    ```js
    /**
    * Normaliza y obtiene la IP real del cliente desde la request
    */
    const getClientIp = (req) => {
        if (!req) return '127.0.0.1';

        let ip =
            req.headers?.['x-forwarded-for']?.split(',')[0].trim() ||
            req.socket?.remoteAddress ||
            req.ip;

        if (ip === '::1' || ip === '::ffff:127.0.0.1') {
            return '127.0.0.1';
        }
        return ip || '127.0.0.1';
    };

    module.exports = { getClientIp };    
    ```

### 🛡️ Paso 5: Middlewares Fundamentales (`src/middlewares/`)
+ Crea la capa intermedia para el manejo de peticiones, seguridad y errores:
1. `backend/src/middlewares/error.middleware.js`: Capturador global de excepciones/errores de la API:
    ```js
    const { prismaRaw } = require('../config/prisma');
    const multer = require('multer');

    const errorHandler = async (err, req, res, next) => {
        let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
        let message = err.message || 'Error interno del servidor';
        let errorCode = null;

        // 1. Detección y normalización de errores de Multer
        if (err instanceof multer.MulterError) {
            statusCode = 400;
            errorCode = err.code;

            switch (err.code) {
                case 'LIMIT_FILE_SIZE':
                    message = 'El archivo supera el tamaño máximo permitido (máx 2MB)';
                    break;
                case 'LIMIT_UNEXPECTED_FILE':
                    message = `El campo '${err.field}' no es válido para la carga del archivo`;
                    break;
                case 'LIMIT_FILE_COUNT':
                    message = 'Has excedido el número máximo de archivos permitidos';
                    break;
                default:
                    message = `Error en la carga: ${err.message}`;
            }
        }

        const logLevel = statusCode >= 500 ? 'ERROR' : 'WARN';
        console.error(`[SYSTEM ${logLevel}] ${req.method} ${req.originalUrl}:`, err);

        // 2. Registro en base de datos (System Log)
        try {
            await prismaRaw.systemLog.create({
                data: {
                    level: logLevel,
                    message: message,
                    stackTrace: err.stack,
                    path: req.originalUrl,
                    method: req.method,
                    statusCode: statusCode,
                    userId: req.user?.id || null
                }
            });
            console.log('✅ Log de sistema registrado exitosamente en BD');
        } catch (dbErr) {
            console.error('⚠️ Falló al insertar el log en la BD:', dbErr.message);
        }

        // 3. Respuesta JSON al cliente
        const responsePayload = {
            status: statusCode >= 500 ? 'error' : 'fail',
            message: statusCode === 500 ? 'Ha ocurrido un error inesperado en el servidor' : message
        };

        if (errorCode) {
            responsePayload.code = errorCode;
        }

        return res.status(statusCode).json(responsePayload);
    };

    module.exports = { errorHandler };  
    ```
2. `backend/src/middlewares/validate.middleware.js`: Validación de esquemas de entrada (request body/params):
    ```js
    const { validationResult } = require('express-validator');

    const validate = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                errors: errors.array().map((err) => ({
                    field: err.path,
                    message: err.msg,
                })),
            });
        }
        next();
    };

    module.exports = validate;    
    ```
3. `backend/src/middlewares/auth.middleware.js`: Verificación y decodificación de tokens JWT:
    ```js
    const jwt = require('jsonwebtoken');
    const prisma = require('../config/prisma');
    const { auditStorage } = require('./auditContext.middleware');

    // 1. Verificar si la petición incluye un Token JWT válido y poblar el contexto de auditoría
    const authenticateJWT = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'fail',
                message: 'Acceso no autorizado. Debe proporcionar un Token Bearer',
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Adjunta el usuario (id, email, roles) al objeto request

            // Actualizar el context store con el ID del usuario decodificado
            const store = auditStorage.getStore();
            if (store) {
                store.userId = decoded.id;
            }

            next();
        } catch (error) {
            return res.status(403).json({
                status: 'fail',
                message: 'Token inválido o expirado',
            });
        }
    };

    // 2. Control de Acceso Basado en Roles (RBAC)
    const authorizeRoles = (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user || !req.user.roles) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Acceso denegado. Sin roles asignados',
                });
            }

            const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

            if (!hasRole) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'No tienes los permisos requeridos para ejecutar esta acción',
                });
            }

            next();
        };
    };

    // 3. Middleware para verificar si el usuario posee un permiso específico
    const checkPermission = (requiredPermission) => {
        return async (req, res, next) => {
            try {
                const userId = req.user.id;

                // Consultar los roles del usuario incluyendo sus permisos
                const userWithRoles = await prisma.user.findUnique({
                    where: { id: userId },
                    include: {
                        roles: {
                            include: {
                                role: {
                                    include: {
                                        permissions: {
                                            include: { permission: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                if (!userWithRoles) {
                    return res.status(401).json({ status: 'fail', message: 'Usuario no autenticado' });
                }

                // Extraer nombres de roles
                const userRoleNames = userWithRoles.roles.map(ur => ur.role.name);

                // SUPER_ADMIN tiene acceso global a todo
                if (userRoleNames.includes('SUPER_ADMIN')) {
                    return next();
                }

                // Extraer todas las acciones permitidas de todos sus roles
                const userPermissions = new Set();
                userWithRoles.roles.forEach(ur => {
                    ur.role.permissions.forEach(rp => {
                        userPermissions.add(rp.permission.action);
                    });
                });

                if (!userPermissions.has(requiredPermission)) {
                    return res.status(403).json({
                        status: 'fail',
                        message: `No tienes el permiso necesario (${requiredPermission}) para realizar esta acción`,
                    });
                }

                next();
            } catch (error) {
                console.error('Error en verificación de permisos:', error);
                return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
            }
        };
    };

    module.exports = { authenticateJWT, authorizeRoles, checkPermission };   
    ```
4. `backend/src/middlewares/role.middleware.js`: Control de acceso basado en roles (RBAC):
    ```js
    const requireRoles = (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user || !req.user.roles) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Acceso denegado: Usuario sin información de roles',
                });
            }

            const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

            if (!hasRole) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'No tienes los permisos necesarios para realizar esta acción',
                });
            }

            next();
        };
    };

    module.exports = { requireRoles };    
    ```
5. `backend/src/middlewares/auditContext.middleware.js`: Inyección del contexto del usuario/petición para trazabilidad de auditoría:
    ```js
    const { AsyncLocalStorage } = require('async_hooks');

    const auditStorage = new AsyncLocalStorage();

    const setAuditUser = (req, res, next) => {
        // Se ejecuta el siguiente middleware dentro del contexto de AsyncLocalStorage
        auditStorage.run({}, () => {
            // En este punto inicial req.user puede ser undefined si la ruta aún no ha pasado por protect
            next();
        });
    };

    module.exports = { setAuditUser, auditStorage };
    ```
6. `backend/src/middlewares/upload.middleware.js`: Procesamiento e intercepción de subida de archivos (Multer/Memory storage):
    ```js
    const multer = require('multer');
    const fs = require('fs');
    const path = require('path');

    // Almacenamiento en memoria para Supabase
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            // Asegurar que la carpeta exista únicamente cuando se recibe una petición de subida
            const uploadDir = path.join(__dirname, '../../uploads/avatars');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, true);
        } else {
            cb(new Error('Formato no soportado. Solo se permiten archivos de imagen.'), false);
        }
    };

    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 2 * 1024 * 1024, // 2 MB
        },
    });

    module.exports = upload;    
    ```

### 💼 Paso 5: Servicios de Negocio (`src/services/`)
+ Crea la lógica de negocio independiente de las rutas HTTP:
1. `backend/src/services/audit.service.js`: Métodos para registrar y consultar eventos del sistema en la base de datos (logs de auditoría).
    ```js
    const prisma = require('../config/prisma');

    export const auditService = {
        /**
        * Registra un evento en la auditoría.
        */
        async log({ userId = null, action, entity, entityId = null, details = null, req = null }) {
            try {
            let ipAddress = null;

            if (req) {
                ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            }

            await prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    entity,
                    entityId,
                    details,
                    ipAddress,
                },
            });
            } catch (error) {
                // Evitamos que un error guardando el log tumbe la petición principal
                console.error('[AUDIT LOG ERROR]:', error);
            }
        },
    };    
    ```
    + Ejemplo de cómo usarlo en cualquier controller:
        ```js
        // Ejemplo: Al actualizar los roles de un usuario
        await auditService.log({
            userId: req.user.id, // Usuario que realiza la acción
            action: 'UPDATE_ROLES',
            entity: 'User',
            entityId: targetUserId,
            details: { rolesAnteriores: oldRoles, rolesNuevos: newRoles },
            req,
        });
        ```

### 🎮 Paso 7: Controladores de la API (`src/controllers/`)
+ Implementa la capa de orquestación de respuesta para cada dominio:
1. `backend/src/controllers/auth.controller.js`: Login, registro, cambio de contraseña y refresco de tokens:
    ```js
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const prisma = require('../config/prisma');
    const { getClientIp } = require('../utils/request.utils');

    const generateToken = (user, roles = []) => {
        return jwt.sign(
            { id: user.id, email: user.email, roles },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    };

    const register = async (req, res) => {
        try {
            const { email, password, firstName, lastName } = req.body;
            const fullName = `${firstName} ${lastName}`;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ status: 'fail', message: 'El correo electrónico ya está registrado' });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = await prisma.user.create({
                data: { email, password: passwordHash, name: fullName },
                select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
            });

            const token = generateToken(newUser, []);

            return res.status(201).json({
                status: 'success',
                message: 'Usuario registrado correctamente',
                data: { user: { ...newUser, roles: [] }, token },
            });
        } catch (error) {
            console.error('Error en registro:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    const login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email },
                include: { roles: { include: { role: true } } },
            });

            if (!user || !user.isActive) {
                if (!user) {
                    await prisma.auditLog.create({
                        data: {
                            action: 'LOGIN_FAILED',
                            entity: 'Auth',
                            ipAddress: getClientIp(req),
                            details: JSON.stringify({ email, reason: 'Usuario no encontrado' }),
                        },
                    });
                }
                return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas o cuenta desactivada' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                await prisma.auditLog.create({
                    data: {
                        action: 'LOGIN_FAILED',
                        entity: 'Auth',
                        ipAddress: getClientIp(req),
                        details: JSON.stringify({ email, reason: 'Contraseña incorrecta' }),
                    },
                });
                return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
            }

            const userRoles = user.roles.map((ur) => ur.role.name);
            const token = generateToken(user, userRoles);

            await prisma.auditLog.create({
                data: {
                    action: 'LOGIN_SUCCESS',
                    entity: 'Auth',
                    entityId: String(user.id),
                    ipAddress: getClientIp(req),
                    user: { connect: { id: user.id } },
                    details: JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'] }),
                },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Inicio de sesión exitoso',
                data: {
                    user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, roles: userRoles },
                    token,
                },
            });
        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    const getMe = async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatarUrl: true,
                    createdAt: true,
                    roles: { select: { role: { select: { name: true } } } },
                },
            });

            if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

            const userRoles = user.roles.map((ur) => ur.role.name);

            return res.status(200).json({
                status: 'success',
                data: { user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, roles: userRoles, createdAt: user.createdAt } },
            });
        } catch (error) {
            console.error('Error en getMe:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    const logout = async (req, res) => {
        try {
            if (req.user?.id) {
                await prisma.auditLog.create({
                    data: {
                        action: 'LOGOUT',
                        entity: 'Auth',
                        entityId: String(req.user.id),
                        ipAddress: getClientIp(req),
                        user: { connect: { id: req.user.id } },
                        details: JSON.stringify({ ip: req.ip }),
                    },
                });
            }
            return res.status(200).json({ status: 'success', message: 'Sesión cerrada correctamente' });
        } catch (error) {
            console.error('Error en logout:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    module.exports = { register, login, getMe, logout };   
    ```
2. `backend/src/controllers/profile.controller.js`: Gestión de perfil de usuario autenticado:
    ```js
    const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
    const { s3Client, ensureBucketExists } = require('../config/s3');
    const prisma = require('../config/prisma');
    const bcrypt = require('bcryptjs');
    const path = require('path');

    /**
    * Helper para eliminar una imagen existente en S3 dada su URL pública
    */
    const deleteExistingS3File = async (publicUrl) => {
        if (!publicUrl) return;

        try {
            const bucketName = process.env.S3_BUCKET_NAME || 'app-uploads';
            const s3PublicBaseUrl = `${process.env.S3_PUBLIC_URL}/`;

            // Extraer la Key (ruta interna en el bucket) quitando el prefijo de la URL pública
            if (publicUrl.startsWith(s3PublicBaseUrl)) {
                const key = publicUrl.replace(s3PublicBaseUrl, '');
                console.log(`🗑️ Eliminando archivo anterior en S3: ${key}`);

                await s3Client.send(new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: key
                }));
            }
        } catch (err) {
            // Loguear el error pero no bloquear el flujo si el archivo ya no existía
            console.warn('⚠️ No se pudo eliminar la imagen anterior en S3:', err.message);
        }
    };

    /**
    * Subir o Reemplazar Avatar
    */
    const uploadAvatar = async (req, res) => {
        try {
            const userId = req.user.id;

            if (!req.file) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'No se ha adjuntado ningún archivo de imagen',
                });
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
            }

            const bucketName = process.env.S3_BUCKET_NAME || 'app-uploads';
            await ensureBucketExists(bucketName);

            // 1. Eliminar la imagen previa si existía
            if (user.avatarUrl) {
                await deleteExistingS3File(user.avatarUrl);
            }

            // 2. Subir la nueva imagen
            const fileExt = path.extname(req.file.originalname);
            const fileName = `avatars/user_${userId}_${Date.now()}${fileExt}`;

            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                // ACL: 'public-read' // Opcional: marca el archivo como legible públicamente
            }));

            const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;

            // 3. Actualizar la base de datos
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: publicUrl },
                select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Imagen de perfil actualizada correctamente',
                data: { user: updatedUser },
            });
        } catch (error) {
            console.error('🔥 Error en uploadAvatar / S3:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al procesar la imagen',
            });
        }
    };

    /**
    * Eliminar Avatar Actual del Perfil
    */
    const deleteAvatar = async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user) {
                return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
            }

            if (user.avatarUrl) {
                await deleteExistingS3File(user.avatarUrl);
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: null },
                select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Imagen de perfil eliminada correctamente',
                data: { user: updatedUser },
            });
        } catch (error) {
            console.error('🔥 Error en deleteAvatar / S3:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al eliminar la imagen',
            });
        }
    };

    const updateProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, currentPassword, newPassword } = req.body;

            // Buscar usuario actual
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
            }

            const updateData = {};

            // Actualizar nombre si fue enviado
            if (name && name.trim() !== '') {
                updateData.name = name.trim();
            }

            // Si intenta cambiar la contraseña
            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Debes proporcionar la contraseña actual para establecer una nueva.'
                    });
                }

                // Validar contraseña actual
                const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'La contraseña actual es incorrecta.'
                    });
                }

                // Encriptar nueva contraseña
                updateData.password = await bcrypt.hash(newPassword, 10);
            }

            // Si hay datos para actualizar
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    createdAt: true
                }
            });

            return res.status(200).json({
                status: 'success',
                message: 'Perfil actualizado correctamente',
                data: { user: updatedUser }
            });
        } catch (error) {
            console.error('Error en updateProfile:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al actualizar el perfil'
            });
        }
    };

    module.exports = { uploadAvatar, deleteAvatar, updateProfile };    
    ```
3. `backend/src/controllers/role.controller.js`: Administración de roles y permisos:
    ```js
    const prisma = require('../config/prisma');

    // Listar todos los roles con sus permisos asignados
    const getRoles = async (req, res) => {
        try {
            const roles = await prisma.role.findMany({
                include: {
                    permissions: {
                        include: { permission: true }
                    },
                    _count: { select: { users: true } } // Cantidad de usuarios con este rol
                },
                orderBy: { name: 'asc' }
            });

            const formattedRoles = roles.map(r => ({
                id: r.id,
                name: r.name,
                description: r.description,
                userCount: r._count.users,
                permissions: r.permissions.map(p => p.permission.action),
                createdAt: r.createdAt
            }));

            return res.status(200).json({ status: 'success', data: { roles: formattedRoles } });
        } catch (error) {
            console.error('Error al obtener roles:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Listar todo el catálogo de permisos disponibles (agrupados por módulo)
    const getPermissions = async (req, res) => {
        try {
            const permissions = await prisma.permission.findMany({
                orderBy: [{ module: 'asc' }, { action: 'asc' }]
            });

            return res.status(200).json({ status: 'success', data: { permissions } });
        } catch (error) {
            console.error('Error al obtener permisos:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Crear un nuevo rol con permisos asociados
    const createRole = async (req, res) => {
        try {
            const { name, description, permissions = [] } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ status: 'fail', message: 'El nombre del rol es obligatorio' });
            }

            const formattedName = name.trim().toUpperCase();

            // Verificar unicidad
            const existingRole = await prisma.role.findUnique({ where: { name: formattedName } });
            if (existingRole) {
                return res.status(400).json({ status: 'fail', message: 'El nombre del rol ya existe' });
            }

            // Buscar IDs de los permisos enviados
            const dbPermissions = await prisma.permission.findMany({
                where: { action: { in: permissions } }
            });

            const newRole = await prisma.role.create({
                data: {
                    name: formattedName,
                    description,
                    permissions: {
                        create: dbPermissions.map(p => ({ permissionId: p.id }))
                    }
                }
            });

            return res.status(201).json({
                status: 'success',
                message: 'Rol creado exitosamente',
                data: { role: newRole }
            });
        } catch (error) {
            console.error('Error al crear rol:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Actualizar rol y sincronizar permisos
    const updateRole = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, permissions = [] } = req.body;

            const existingRole = await prisma.role.findUnique({ where: { id } });
            if (!existingRole) {
                return res.status(404).json({ status: 'fail', message: 'Rol no encontrado' });
            }

            // Proteger el rol SUPER_ADMIN de cambios de nombre
            if (existingRole.name === 'SUPER_ADMIN' && name && name.toUpperCase() !== 'SUPER_ADMIN') {
                return res.status(400).json({ status: 'fail', message: 'No se puede renombrar el rol SUPER_ADMIN' });
            }

            const formattedName = name ? name.trim().toUpperCase() : existingRole.name;

            // Obtener los permisos válidos
            const dbPermissions = await prisma.permission.findMany({
                where: { action: { in: permissions } }
            });

            // Transacción: eliminar permisos anteriores y crear los nuevos
            await prisma.$transaction([
                prisma.rolePermission.deleteMany({ where: { roleId: id } }),
                prisma.role.update({
                    where: { id },
                    data: {
                        name: formattedName,
                        description,
                        permissions: {
                            create: dbPermissions.map(p => ({ permissionId: p.id }))
                        }
                    }
                })
            ]);

            return res.status(200).json({
                status: 'success',
                message: 'Rol actualizado correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Eliminar un rol
    const deleteRole = async (req, res) => {
        try {
            const { id } = req.params;

            const role = await prisma.role.findUnique({ where: { id } });
            if (!role) {
                return res.status(404).json({ status: 'fail', message: 'Rol no encontrado' });
            }

            // Protección estricta: No borrar roles core del sistema
            if (['SUPER_ADMIN', 'USER'].includes(role.name)) {
                return res.status(400).json({
                    status: 'fail',
                    message: `El rol del sistema "${role.name}" no puede ser eliminado.`
                });
            }

            await prisma.role.delete({ where: { id } });

            return res.status(200).json({ status: 'success', message: 'Rol eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    module.exports = {
        getRoles,
        getPermissions,
        createRole,
        updateRole,
        deleteRole
    };    
    ```
4. `backend/src/controllers/user.controller.js`: Administación de usuarios:
    ```js
    const bcrypt = require('bcryptjs');
    const path = require('path');
    const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
    const { s3Client, ensureBucketExists } = require('../config/s3');
    const prisma = require('../config/prisma');

    // Helper interno para S3
    const deleteExistingS3File = async (publicUrl) => {
        if (!publicUrl) return;
        try {
            const bucketName = process.env.S3_BUCKET_NAME || 'app-uploads';
            const s3PublicBaseUrl = `${process.env.S3_PUBLIC_URL}/`;
            if (publicUrl.startsWith(s3PublicBaseUrl)) {
                const key = publicUrl.replace(s3PublicBaseUrl, '');
                await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
            }
        } catch (err) {
            console.warn('⚠️ No se pudo eliminar la imagen anterior en S3:', err.message);
        }
    };

    // Helper genérico para procesar la subida de un avatar por userId
    const processAvatarUpload = async (userId, file) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { error: 'Usuario no encontrado', statusCode: 404 };

        const bucketName = process.env.S3_BUCKET_NAME || 'app-uploads';
        await ensureBucketExists(bucketName);

        if (user.avatarUrl) await deleteExistingS3File(user.avatarUrl);

        const fileExt = path.extname(file.originalname);
        const fileName = `avatars/user_${userId}_${Date.now()}${fileExt}`;

        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: publicUrl },
            select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
        });

        return { user: updatedUser };
    };

    // Helper genérico para eliminar un avatar por userId
    const processAvatarDelete = async (userId) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { error: 'Usuario no encontrado', statusCode: 404 };

        if (user.avatarUrl) await deleteExistingS3File(user.avatarUrl);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: null },
            select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
        });

        return { user: updatedUser };
    };

    // Listar usuarios (búsqueda + paginación + ordenamiento)
    const getUsers = async (req, res) => {
        try {
            const { search = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const where = search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {};

            const allowedSortFields = ['name', 'email', 'createdAt'];
            const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
            const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';

            const [total, users] = await prisma.$transaction([
                prisma.user.count({ where }),
                prisma.user.findMany({
                    where,
                    skip,
                    take: parseInt(limit),
                    orderBy: [{ [validSortBy]: validSortOrder }, { id: 'asc' }],
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                        isActive: true,
                        createdAt: true,
                        roles: { select: { role: { select: { name: true } } } },
                    },
                }),
            ]);

            const formattedUsers = users.map((u) => ({
                ...u,
                roles: u.roles.map((r) => r.role.name),
            }));

            return res.status(200).json({
                status: 'success',
                data: {
                    users: formattedUsers,
                    pagination: {
                        total,
                        page: parseInt(page),
                        totalPages: Math.ceil(total / parseInt(limit)),
                    },
                },
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Crear usuario
    const createUser = async (req, res) => {
        try {
            const { name, email, password, role = 'USER' } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ status: 'fail', message: 'El correo electrónico ya existe' });
            }

            const roleObj = await prisma.role.findUnique({ where: { name: role } });
            if (!roleObj) {
                return res.status(400).json({ status: 'fail', message: `El rol ${role} no existe` });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: passwordHash,
                    roles: { create: { roleId: roleObj.id } },
                },
                select: { id: true, email: true, name: true, createdAt: true },
            });

            return res.status(201).json({ status: 'success', data: { user: newUser } });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Actualizar usuario por ID
    const updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, password, avatarUrl } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { id } });
            if (!existingUser) {
                return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
            }

            if (email && email !== existingUser.email) {
                const emailTaken = await prisma.user.findUnique({ where: { email } });
                if (emailTaken) {
                    return res.status(400).json({ status: 'fail', message: 'El correo electrónico ya está en uso' });
                }
            }

            const updateData = {
                name: name || existingUser.name,
                email: email || existingUser.email,
            };

            if (password && password.trim() !== '') {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            // Si se recibe explícitamente avatarUrl: null, eliminamos el archivo en S3 y en la BD
            if (avatarUrl === null) {
                if (existingUser.avatarUrl) {
                    await deleteExistingS3File(existingUser.avatarUrl);
                }
                updateData.avatarUrl = null;
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    isActive: true,
                    createdAt: true,
                    roles: { select: { role: { select: { name: true } } } },
                },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Usuario actualizado correctamente',
                data: { user: { ...updatedUser, roles: updatedUser.roles.map((r) => r.role.name) } },
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Asignar roles a un usuario
    const updateUserRoles = async (req, res) => {
        try {
            const { id } = req.params;
            const { roles } = req.body;

            await prisma.userRole.deleteMany({ where: { userId: id } });

            if (roles && roles.length > 0) {
                const dbRoles = await prisma.role.findMany({ where: { name: { in: roles } } });
                const userRolesData = dbRoles.map((role) => ({ userId: id, roleId: role.id }));
                await prisma.userRole.createMany({ data: userRolesData });
            }

            return res.status(200).json({ status: 'success', message: 'Roles actualizados correctamente' });
        } catch (error) {
            console.error('Error al actualizar roles de usuario:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Eliminar usuario
    const deleteUser = async (req, res) => {
        try {
            const { id } = req.params;
            if (req.user.id === id) {
                return res.status(400).json({ status: 'fail', message: 'No puedes eliminar tu propia cuenta' });
            }

            await prisma.userRole.deleteMany({ where: { userId: id } });
            await prisma.user.delete({ where: { id } });

            return res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar el usuario' });
        }
    };

    // Actualizar perfil del usuario autenticado (/me)
    const updateProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, currentPassword, newPassword } = req.body;

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

            const updateData = {};
            if (name && name.trim() !== '') updateData.name = name.trim();

            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({ status: 'fail', message: 'Debes proporcionar la contraseña actual.' });
                }
                const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ status: 'fail', message: 'La contraseña actual es incorrecta.' });
                }
                updateData.password = await bcrypt.hash(newPassword, 10);
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
            });

            return res.status(200).json({ status: 'success', message: 'Perfil actualizado correctamente', data: { user: updatedUser } });
        } catch (error) {
            console.error('Error en updateProfile:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    // Subir Avatar
    const uploadAvatar = async (req, res) => {
        try {
            const userId = req.user.id;
            if (!req.file) return res.status(400).json({ status: 'fail', message: 'No se ha adjuntado ninguna imagen' });

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

            const bucketName = process.env.S3_BUCKET_NAME || 'app-uploads';
            await ensureBucketExists(bucketName);

            if (user.avatarUrl) await deleteExistingS3File(user.avatarUrl);

            const fileExt = path.extname(req.file.originalname);
            const fileName = `avatars/user_${userId}_${Date.now()}${fileExt}`;

            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }));

            const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: publicUrl },
                select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
            });

            return res.status(200).json({ status: 'success', message: 'Avatar actualizado', data: { user: updatedUser } });
        } catch (error) {
            console.error('Error en uploadAvatar:', error);
            return res.status(500).json({ status: 'error', message: 'Error al procesar la imagen' });
        }
    };

    // Eliminar Avatar
    const deleteAvatar = async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

            if (user.avatarUrl) await deleteExistingS3File(user.avatarUrl);

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: null },
                select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
            });

            return res.status(200).json({ status: 'success', message: 'Avatar eliminado', data: { user: updatedUser } });
        } catch (error) {
            console.error('Error en deleteAvatar:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar el avatar' });
        }
    };

    // Subir Avatar de un Usuario por ID (Admin)
    const uploadUserAvatarById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!req.file) return res.status(400).json({ status: 'fail', message: 'No se ha adjuntado ninguna imagen' });

            const result = await processAvatarUpload(id, req.file);
            if (result.error) return res.status(result.statusCode).json({ status: 'fail', message: result.error });

            return res.status(200).json({ status: 'success', message: 'Avatar de usuario actualizado', data: { user: result.user } });
        } catch (error) {
            console.error('Error en uploadUserAvatarById:', error);
            return res.status(500).json({ status: 'error', message: 'Error al procesar la imagen' });
        }
    };

    // Eliminar Avatar de un Usuario por ID (Admin)
    const deleteUserAvatarById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await processAvatarDelete(id);
            if (result.error) return res.status(result.statusCode).json({ status: 'fail', message: result.error });

            return res.status(200).json({ status: 'success', message: 'Avatar de usuario eliminado', data: { user: result.user } });
        } catch (error) {
            console.error('Error en deleteUserAvatarById:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar el avatar' });
        }
    };

    module.exports = {
        getUsers,
        createUser,
        updateUser,
        updateUserRoles,
        deleteUser,
        updateProfile,
        uploadAvatar,
        deleteAvatar,
        uploadUserAvatarById,
        deleteUserAvatarById
    };
    ```
5. `backend/src/controllers/audit.controller.js`: Consulta de registros de auditoría del sistema:
    ```js
    const prisma = require('../config/prisma');

    const getAuditLogs = async (req, res) => {
        try {
            const { 
                page = 1, 
                limit = 15, 
                entity, 
                action, 
                search,
                startDate,
                endDate,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const parsedPage = Math.max(1, parseInt(page, 10) || 1);
            const parsedLimit = Math.max(1, parseInt(limit, 10) || 15);

            const skip = (parsedPage - 1) * parsedLimit;
            const take = parsedLimit;

            const where = {};

            // Validamos que no vengan como cadenas vacías desde req.query
            if (entity && entity.trim() !== '') {
                where.entity = entity;
            }

            if (action && action.trim() !== '') {
                where.action = { contains: action, mode: 'insensitive' };
            }
            
            if (search && search.trim() !== '') {
                where.OR = [
                    { action: { contains: search, mode: 'insensitive' } },
                    { entity: { contains: search, mode: 'insensitive' } },
                    { user: { name: { contains: search, mode: 'insensitive' } } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                ];
            }

            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    where.createdAt.gte = start;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    where.createdAt.lte = end;
                }
            }

            // Construcción del ordenamiento dinámico
            let orderBy = {};
            if (sortBy === 'user') {
                orderBy = { user: { name: sortOrder } };
            } else if (['action', 'entity', 'createdAt'].includes(sortBy)) {
                orderBy = { [sortBy]: sortOrder };
            } else {
                orderBy = { createdAt: 'desc' };
            }

            const [logs, total] = await Promise.all([
                prisma.auditLog.findMany({
                    where,
                    skip,
                    take,
                    orderBy, // <--- Pasar la variable aquí
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                }),
                prisma.auditLog.count({ where }),
            ]);        

            return res.json({
                status: 'success',
                data: {
                    logs,
                    pagination: {
                        total,
                        page: parsedPage,
                        totalPages: Math.ceil(total / take) || 1,
                    },
                },
            });
        } catch (error) {
            console.error('Error al obtener audit logs:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    };

    module.exports = { getAuditLogs };    
    ```

### 🛣️ Paso 8: Definición de Rutas (`src/routes/`)
+ Enlaza los endpoints HTTP con sus respectivos middlewares y controladores:
1. `backend/src/routes/auth.routes.js`: Rutas de autenticación (/api/v1/auth/*):
    ```js
    const express = require('express');
    const { body } = require('express-validator');
    const router = express.Router();
    const { register, login, getMe, logout } = require('../controllers/auth.controller');
    const { authenticateJWT } = require('../middlewares/auth.middleware');
    const validate = require('../middlewares/validate.middleware');

    const registerValidation = [
        body('email').isEmail().withMessage('Correo electrónico inválido'),
        body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
        body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
        body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
        validate,
    ];

    const loginValidation = [
        body('email').isEmail().withMessage('Correo electrónico inválido'),
        body('password').notEmpty().withMessage('La contraseña es obligatoria'),
        validate,
    ];

    router.post('/register', registerValidation, register);
    router.post('/login', loginValidation, login);
    router.get('/me', authenticateJWT, getMe);
    router.post('/logout', authenticateJWT, logout);

    module.exports = router;   
    ```
2. `backend/src/routes/user.routes.js`: Rutas admimistración de usuarios (/api/v1/user/*):
    ```js
    const express = require('express');
    const { body } = require('express-validator');
    const router = express.Router();
    const userController = require('../controllers/user.controller');
    const { authenticateJWT, checkPermission, authorizeRoles } = require('../middlewares/auth.middleware');
    const validate = require('../middlewares/validate.middleware');
    const upload = require('../middlewares/upload.middleware');

    // Todas las rutas de usuario requieren estar autenticado
    router.use(authenticateJWT);

    // Endpoints del Perfil Propio (/api/v1/users/profile, /api/v1/users/avatar)
    router.put('/profile', userController.updateProfile);
    router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);
    router.delete('/avatar', userController.deleteAvatar);

    // Endpoints Administrativos de Usuarios
    const createUserValidation = [
        body('name').notEmpty().withMessage('El nombre es obligatorio'),
        body('email').isEmail().withMessage('Correo electrónico inválido'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        validate,
    ];

    router.get('/', checkPermission('users:read'), userController.getUsers);
    router.post('/', checkPermission('users:create'), createUserValidation, userController.createUser);
    router.put('/:id', checkPermission('users:update'), userController.updateUser);
    router.put('/:id/roles', authorizeRoles('SUPER_ADMIN'), userController.updateUserRoles);
    router.delete('/:id', checkPermission('users:delete'), userController.deleteUser);

    // 🆕 Endpoints Administrativos para Avatar por ID
    router.post('/:id/avatar', checkPermission('SUPER_ADMIN'), upload.single('avatar'), userController.uploadUserAvatarById);
    router.delete('/:id/avatar', checkPermission('SUPER_ADMIN'), userController.deleteUserAvatarById);

    module.exports = router;
    ```
3. `backend/src/routes/role.routes.js`: Rutas administración de roles (/api/v1/role/*):
    ```js
    const express = require('express');
    const router = express.Router();
    const roleController = require('../controllers/role.controller');
    const { authenticateJWT, checkPermission } = require('../middlewares/auth.middleware');

    router.use(authenticateJWT);

    router.get('/', checkPermission('roles:read'), roleController.getRoles);
    router.get('/permissions', checkPermission('roles:read'), roleController.getPermissions);
    router.post('/', checkPermission('roles:create'), roleController.createRole);
    router.put('/:id', checkPermission('roles:update'), roleController.updateRole);
    router.delete('/:id', checkPermission('roles:delete'), roleController.deleteRole);

    module.exports = router;
    ```
4. `backend/src/routes/audit.routes.js`: Rutas asociadas a las auditorias (/api/v1/audit/*):
    ```js
    const express = require('express');
    const router = express.Router();
    const { getAuditLogs } = require('../controllers/audit.controller');
    const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');

    router.use(authenticateJWT);
    router.get('/', authorizeRoles('SUPER_ADMIN'), getAuditLogs);

    module.exports = router;
    ```
5. `backend/src/routes/index.js`: Router central que registra todos los módulos:
    ```js
    const express = require('express');
    const router = express.Router();

    const authRoutes = require('./auth.routes');
    const userRoutes = require('./user.routes');
    const roleRoutes = require('./role.routes');
    const auditRoutes = require('./audit.routes');

    // Definición limpia de módulos
    router.use('/auth', authRoutes);
    router.use('/users', userRoutes);
    router.use('/roles', roleRoutes);
    router.use('/audit-logs', auditRoutes);

    module.exports = router;
    ```

### 🌱 Paso 9: Seeders y Scripts de Datos (`src/seeders/` & `src/`)
+ Define la siembra de datos de desarrollo y producción:
1. `backend/src/seeders/role-permission.seeder.js`: Script para generar roles y permisos:
    ```js
    const prisma = require('../config/prisma');

    async function seedRolesAndPermissions() {
        console.log('🌱 Iniciando la carga de roles y permisos iniciales...');

        // 1. Definición de Roles
        const roles = [
            { name: 'SUPER_ADMIN', description: 'Acceso total y gestión del sistema' },
            { name: 'ADMIN', description: 'Administrador de contenido y usuarios' },
            { name: 'USER', description: 'Usuario estándar registrado' },
        ];

        for (const role of roles) {
            await prisma.role.upsert({
                where: { name: role.name },
                update: { description: role.description },
                create: role,
            });
        }

        console.log('✅ Roles creados/verificados.');

        // 2. Definición de Permisos Catálogo
        const permissions = [
            // Acceso Global al Dashboard Admin
            { action: 'admin:access', module: 'admin', description: 'Permite acceder al panel de administración' },

            // Módulo de Usuarios
            { action: 'users:read', module: 'users', description: 'Permite ver el listado y detalle de usuarios' },
            { action: 'users:create', module: 'users', description: 'Permite registrar nuevos usuarios' },
            { action: 'users:update', module: 'users', description: 'Permite editar datos de usuarios existentes' },
            { action: 'users:delete', module: 'users', description: 'Permite eliminar usuarios' },
            
            // Módulo de Roles y Permisos
            { action: 'roles:read', module: 'roles', description: 'Permite ver la lista de roles y sus permisos' },
            { action: 'roles:create', module: 'roles', description: 'Permite crear nuevos roles' },
            { action: 'roles:update', module: 'roles', description: 'Permite modificar roles y asignar permisos' },
            { action: 'roles:delete', module: 'roles', description: 'Permite eliminar roles' },

            // Módulo de Auditoría y Logs de Aplicación
            { action: 'audit:read', module: 'audit', description: 'Permite ver el historial de auditoría y actividades' },

            // Módulo de Monitoreo y Logs del Sistema (Backend, DB)
            { action: 'system:logs:read', module: 'system', description: 'Permite consultar logs técnicos del servidor y la base de datos' },
        ];
        
        for (const perm of permissions) {
            await prisma.permission.upsert({
                where: { action: perm.action },
                update: { description: perm.description, module: perm.module },
                create: perm,
            });
        }

        console.log('✅ Catálogo de permisos actualizado.');  
    }

    // Ejecutar si se invoca directamente por CLI
    if (require.main === module) {
        seedRolesAndPermissions()
            .catch((e) => {
                console.error('❌ Error ejecutando el seed:', e);
                process.exit(1);
            })
            .finally(async () => {
                await prisma.$disconnect();
            });
    }

    module.exports = seedRolesAndPermissions;    
    ```
2. `backend/src/seeders/superadmin.seeder.js`: Script para generar el usuario Superadmin por defecto:
    ```js
    const bcrypt = require('bcryptjs');
    const prisma = require('../config/prisma');
    require('dotenv').config();

    const seedSuperAdmin = async () => {
        try {
            console.log('🌱 Iniciando Seeder de SuperAdmin...');

            const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@boilerplate.com';
            const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

            if (!adminPassword) {
                throw new Error('❌ Error: Debes definir SUPER_ADMIN_PASSWORD en tu archivo .env');
            }

            // 1. Verificar que el rol SUPER_ADMIN exista (sembrado previamente por role-permission.seeder.js)
            const superAdminRole = await prisma.role.findUnique({
                where: { name: 'SUPER_ADMIN' },
            });

            if (!superAdminRole) {
                throw new Error('❌ El rol SUPER_ADMIN no existe. Ejecuta primero el seeder de Roles y Permisos.');
            }

            // 2. Comprobar si el usuario ya existe
            const existingUser = await prisma.user.findUnique({
                where: { email: adminEmail },
                include: { roles: true },
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            if (!existingUser) {
                // Crear usuario con el rol de SuperAdmin
                const adminUser = await prisma.user.create({
                    data: {
                        name: 'Super Admin',
                        email: adminEmail,
                        password: hashedPassword,
                        roles: {
                            create: {
                                roleId: superAdminRole.id,
                            },
                        },
                    },
                });
                console.log(`✅ SuperAdmin creado con éxito: ${adminUser.email}`);
            } else {
                // Asegurar que tenga el rol asignado si ya existía el usuario
                const hasRole = existingUser.roles.some((r) => r.roleId === superAdminRole.id);
                if (!hasRole) {
                    await prisma.userRole.create({
                        data: {
                            userId: existingUser.id,
                            roleId: superAdminRole.id,
                        },
                    });
                }
                console.log(`👤 SuperAdmin verificado: ${existingUser.email}`);
            }
        } catch (error) {
            console.error('❌ Error ejecutando el Seeder de SuperAdmin:', error.message);
            throw error;
        }
    };

    if (require.main === module) {
        seedSuperAdmin()
            .catch(() => process.exit(1))
            .finally(async () => {
                await prisma.$disconnect();
            });
    }

    module.exports = seedSuperAdmin;   
    ```
3. `backend/src/seeders/users.seeder.js`: Datos falsos/de prueba para desarrollo:
    ```js
    const { fakerES: faker } = require('@faker-js/faker');
    const bcrypt = require('bcryptjs');
    const prisma = require('../config/prisma');

    const seedUsers = async (quantity = 25) => {
        try {
            console.log(`🌱 Generando ${quantity} usuarios falsos...`);

            const defaultPassword = await bcrypt.hash('Password123!', 10);
            const usersData = [];

            for (let i = 0; i < quantity; i++) {
                const firstName = faker.person.firstName();
                const lastName = faker.person.lastName();
                
                usersData.push({
                    name: `${firstName} ${lastName}`,
                    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
                    password: defaultPassword,
                });
            }

            // Insertar masivamente
            await prisma.user.createMany({
                data: usersData,
                skipDuplicates: true,
            });

            console.log(`✅ ${quantity} usuarios creados exitosamente.`);
        } catch (error) {
            console.error('❌ Error seeding usuarios:', error.message);
        } finally {
            await prisma.$disconnect();
        }
    };

    seedUsers();    
    ```
4. `backend/src/seeders/audit.seeder.js`: Script independiente para verificar o poblar la tabla de auditoría:
    ```js
    const prisma = require('../config/prisma');

    async function seedAudit() {
        // 1. Obtener el primer usuario existente para vincularlo al log
        const user = await prisma.user.findFirst();

        if (!user) {
            console.error('Debes tener al menos un usuario en la tabla User');
            return;
        }

        // 2. Insertar registros de prueba
        await prisma.auditLog.createMany({
            data: [
                {
                    userId: user.id,
                    action: 'CREATE',
                    entity: 'Person',
                    entityId: '1',
                    details: JSON.stringify({ name: 'Juan Pérez', role: 'Padre' }),
                    ipAddress: '127.0.0.1',
                },
                {
                    userId: user.id,
                    action: 'UPDATE',
                    entity: 'User',
                    entityId: String(user.id),
                    details: JSON.stringify({ field: 'email', old: 'old@test.com', new: user.email }),
                    ipAddress: '127.0.0.1',
                },
                {
                    userId: user.id,
                    action: 'LOGIN',
                    entity: 'Auth',
                    entityId: String(user.id),
                    details: JSON.stringify({ message: 'Inicio de sesión exitoso' }),
                    ipAddress: '127.0.0.1',
                },
            ],
        });

        console.log('✅ Logs de prueba creados exitosamente');
    }

    // Exportamos la función para consumirla desde prisma/seed.js si es necesario
    module.exports = seedAudit;

    // Permite ejecutarlo directamente desde la terminal con: node src/seeders/audit.seeder.js
    if (require.main === module) {
        seedAudit()
            .catch((e) => console.error(e))
            .finally(async () => await prisma.$disconnect());
    }   
    ```
 5. Agrega el comando para correr el seeder en el `package.json` de tu Backend:
     ```json
    {
        "scripts": {
            "seed": "node prisma/seed.js"
        },
        "prisma": {
            "seed": "node prisma/seed.js"
        }
    }
     ```

### 🚀 Paso 10: Punto de Entrada de la Aplicación (`src/app.js`)
1. Crea `backend/src/app.js` unificando toda la arquitectura:
    ```js
    const express = require('express');
    const cors = require('cors');
    require('dotenv').config();

    // Middleware para establecer el contexto de auditoría
    const { setAuditUser } = require('./middlewares/auditContext.middleware');
    // Middleware para manejo global de errores de sistema
    const { errorHandler } = require('./middlewares/error.middleware');

    // Rutas
    const routes = require('./routes');

    const app = express();
    const PORT = process.env.PORT || 3000;
    const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

    // Middlewares Globales
    const allowedOrigins = [
        process.env.FRONTEND_URL_PROD,
        process.env.FRONTEND_URL_LOCAL_VITE,
        process.env.FRONTEND_URL_LOCAL_VUE_CLI,
    ].filter(Boolean);

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('No permitido por CORS'));
            }
        },
        credentials: true
    }));

    app.use(express.json());

    // Contexto de auditoría global para envolver la petición HTTP
    app.use(setAuditUser);

    // Ruta raíz informativa
    app.get('/', (req, res) => {
        res.send('API REST de Boilerplate-Node-2026 ejecutándose. Visita /api/v1/health para estado.');
    });

    // Ruta de comprobación de estado (Health Check)
    app.get('/api/v1/health', (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'API Boilerplate-Node-2026 operativa',
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
        });
    });

    // Registrar Rutas de la API
    app.use('/api/v1', routes);

    // --- MANEJO DE ERRORES GLOBALES (Debe ser el último app.use) ---
    app.use(errorHandler);

    // --- CAPTURA DE ERRORES FUERA DEL CICLO HTTP ---
    process.on('unhandledRejection', (reason) => {
        console.error('🔥 [CRITICAL] Promesa no capturada (unhandledRejection):', reason);
    });

    process.on('uncaughtException', (error) => {
        console.error('🔥 [CRITICAL] Excepción no controlada (uncaughtException):', error);
    });

    // Inicialización del Servidor (Asignado a constante server)
    const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en ${APP_URL}`);
        console.log(`📌 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

    // Cierre Limpio (Graceful Shutdown)
    const gracefulShutdown = (signal) => {
        console.log(`\nRecibida señal ${signal}. Cerrando servidor limpiamente...`);
        server.close(() => {
            console.log('Servidor Express cerrado. Puerto liberado.');
            process.exit(0);
        });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    ```
    + Funciones:
        + Carga de variables de entorno (dotenv).
        + Inicialización de Express, CORS y parsing JSON.
        + Inyección de middlewares globales (CORS, Audit context).
        + Registro de routers de /src/routes/.
        + Middleware global de manejo de errores (error.middleware.js).
        + Arranque del servidor (app.listen).
2. Actualizar las referencias en el `backend/package.json` para que tanto node como nodemon apunten al archivo correcto:
    ```json
    {
        "name": "boilerplate-node-2026-backend",
        "version": "1.0.0",
        "description": "API Backend para boilerplate-node-2026",
        "main": "src/app.js",
        "type": "commonjs",
        "scripts": {
            "start": "node src/app.js",
            "start:prod": "npx prisma migrate deploy && node src/app.js",
            "dev": "nodemon src/app.js",
            "test": "echo \"Error: no test specified\" && exit 1",
            "seed": "node prisma/seed.js",
            "db:reset": "prisma migrate reset --force"
        },
        "prisma": {
            "seed": "node prisma/seed.js"
        },
        "repository": {
            "type": "git",
            "url": "git+https://github.com/petrix12/boilerplate-node-2026.git",
            "directory": "backend"
        },
        "bugs": {
            "url": "https://github.com/petrix12/boilerplate-node-2026/issues"
        },
        "homepage": "https://github.com/petrix12/boilerplate-node-2026/tree/main/backend#readme",
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
            "@aws-sdk/client-s3": "^3.1127.0",
            "@prisma/adapter-pg": "6.4.0",
            "@prisma/client": "6.4.0",
            "bcryptjs": "^3.0.3",
            "cors": "^2.8.6",
            "dotenv": "^17.4.2",
            "express": "^4.21.2",
            "express-validator": "^7.3.2",
            "jsonwebtoken": "^9.0.3",
            "multer": "^2.3.0",
            "pg": "^8.23.0"
        },
        "devDependencies": {
            "@faker-js/faker": "^10.6.0",
            "nodemon": "^3.1.14",
            "prisma": "^6.4.0"
        },
        "allowScripts": {
            "@prisma/client@6.4.0": true,
            "prisma@6.4.0": true,
            "@prisma/engines@6.4.0": true,
            "esbuild@0.28.2": true
        }
    }
    ```
3. Regenerar el cliente de Prisma:
    ```bash
    docker compose exec backend npx prisma generate
    ```
    + Ejecuta este comando en la terminal para que Prisma compile de nuevo sus tipos e incluya el soporte para el adaptador de base de datos.
4. Reiniciar el servicio de backend:
    ```bash
    docker compose restart backend
    ```
5. Ejecutar migraciones:
    + Local (Docker):
        ```bash
        docker compose exec backend npx prisma migrate reset
        docker compose exec backend npx prisma generate
        docker compose exec backend npx prisma migrate dev --name init
        ```
        + En caso de problemas:
            ```bash
            # 1. Apagar contenedores y borrar volúmenes de datos
            docker compose down -v

            # 2. Volver a levantar los servicios
            docker compose up -d

            # 3. Aplicar las migraciones desde cero
            docker compose exec backend npx prisma migrate dev --name init
            ```
    + Producción (Supabase):
        ```bash
        DATABASE_URL="postgresql://postgres.<Project ID>:<Password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" npx prisma migrate deploy
        ```
6. Ejecutar seeders:
    + Local (Docker):
        ```bash
        docker compose exec backend node src/seeders/superadmin.seeder.js
        docker compose exec backend node src/seeders/users.seeder.js
        docker compose exec backend node src/seeders/audit.seeder.js
        ```
    + Producción (Supabase):
        ```bash
        DATABASE_URL="postgresql://postgres.<Project ID>:<Password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" node src/seeders/superadmin.seeder.js
        ```

## 📋 Resumen de Endpoints
| Módulo     | Método   | Endpoint                    | Permiso / Rol requerido   |
| ---------- | -------- | --------------------------- | ------------------------- |
| **System** | `GET`    | `/api/v1/health`            | Público                   |
| **Auth**   | `POST`   | `/api/v1/auth/register`     | Público                   |
| **Auth**   | `POST`   | `/api/v1/auth/login`        | Público                   |
| **Auth**   | `GET`    | `/api/v1/auth/me`           | Autenticado               |
| **Auth**   | `POST`   | `/api/v1/auth/logout`       | Autenticado               |
| **Users**  | `PUT`    | `/api/v1/users/profile`     | Autenticado (Propietario) |
| **Users**  | `POST`   | `/api/v1/users/avatar`      | Autenticado (Propietario) |
| **Users**  | `DELETE` | `/api/v1/users/avatar`      | Autenticado (Propietario) |
| **Users**  | `POST`   | `/api/v1/users/:id/avatar`  | Rol `SUPER_ADMIN`         |
| **Users**  | `DELETE` | `/api/v1/users/:id/avatar`  | Rol `SUPER_ADMIN`         |
| **Users**  | `GET`    | `/api/v1/users`             | `users:read`              |
| **Users**  | `POST`   | `/api/v1/users`             | `users:create`            |
| **Users**  | `PUT`    | `/api/v1/users/:id`         | `users:update`            |
| **Users**  | `PUT`    | `/api/v1/users/:id/roles`   | Rol `SUPER_ADMIN`         |
| **Users**  | `DELETE` | `/api/v1/users/:id`         | `users:delete`            |
| **Roles**  | `GET`    | `/api/v1/roles`             | `roles:read`              |
| **Roles**  | `GET`    | `/api/v1/roles/permissions` | `roles:read`              |
| **Roles**  | `POST`   | `/api/v1/roles`             | `roles:create`            |
| **Roles**  | `PUT`    | `/api/v1/roles/:id`         | `roles:update`            |
| **Roles**  | `DELETE` | `/api/v1/roles/:id`         | `roles:delete`            |
| **Audit**  | `GET`    | `/api/v1/audit-logs`        | Rol `SUPER_ADMIN`         |


## ✅ Pruebas de Endpoints
### 🚀 Health Check (Público)
1. Ejecutar:
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/health
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 135
        ETag: W/"87-oMMFBNMzQBBLrTxQ0BxtfZkaXSc"
        Date: Fri, 11 Sep 2026 14:28:25 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"API Boilerplate-Node-2026 operativa","environment":"development","timestamp":"2026-09-11T14:28:25.699Z"}
        ```

### 🚀 Autenticación (Registro y Login)
1. Registro de Usuario (POST `/api/v1/auth/register`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test@example.com",
            "password": "Password123!",
            "firstName": "Pedro",
            "lastName": "Bazó"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 490
        ETag: W/"1ea-Ziyuyh4huSnt7Lm+rOd0shjwLHo"
        Date: Fri, 11 Sep 2026 14:33:04 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Usuario registrado correctamente","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","email":"test@example.com","name":"Pedro Bazó","avatarUrl":null,"createdAt":"2026-09-11T14:33:04.929Z","roles":[]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllYzEyODY1LTk5NjgtNDE0OC05ZjIzLTQyN2MwNjJiNjFhZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGVzIjpbXSwiaWF0IjoxNzg5MTM3MTg0LCJleHAiOjE3ODk3NDE5ODR9.hJZx_Kzt4ctC9DXDoAXHkD7nrSkBTOHGOS32UJD56js"}}bazop@PetrixIesus:~/projects/boilerplate-node-2026$ 
        ```
2. Login (POST `/api/v1/auth/login`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test@example.com",
            "password": "Password123!"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 444
        ETag: W/"1bc-JFL4uAd6y0t1MbhmwuowzSCZ5qY"
        Date: Fri, 11 Sep 2026 14:35:58 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Inicio de sesión exitoso","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","email":"test@example.com","name":"Pedro Bazó","avatarUrl":null,"roles":[]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllYzEyODY1LTk5NjgtNDE0OC05ZjIzLTQyN2MwNjJiNjFhZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGVzIjpbXSwiaWF0IjoxNzg5MTM3MzU4LCJleHAiOjE3ODk3NDIxNTh9.63emy0B8wPbLhjjb2PMuitlQ1YldKfSkD_Mctsg31JQ"}}
        ```
3. Logout (POST `/api/v1/auth/logout`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/logout \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 62
        ETag: W/"3e-JaiL2mK4U1hpoEFpxtcTgglXi2w"
        Date: Sat, 12 Sep 2026 09:56:13 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Sesión cerrada correctamente"}        
        ```

### 🚀 Módulo de Usuario Actual y Perfil
1. Guardar token:
    ```bash
    TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllYzEyODY1LTk5NjgtNDE0OC05ZjIzLTQyN2MwNjJiNjFhZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGVzIjpbXSwiaWF0IjoxNzg5MTM3MzU4LCJleHAiOjE3ODk3NDIxNTh9.63emy0B8wPbLhjjb2PMuitlQ1YldKfSkD_Mctsg31JQ"
    ```
2. Obtener Usuario Autenticado (GET `/api/v1/auth/me`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/auth/me \
        -H "Authorization: Bearer $TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 197
        ETag: W/"c5-bLjFlUieGmW2j4AgO9AAQRgMhB8"
        Date: Fri, 11 Sep 2026 14:46:26 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","email":"test@example.com","name":"Pedro Bazó","avatarUrl":null,"roles":[],"createdAt":"2026-09-11T14:33:04.929Z"}}}
        ```
3. Actualizar Perfil Propio (PUT `/api/v1/users/profile`):
    ```bash
    curl -i -X PUT http://localhost:3000/api/v1/users/profile \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Pedro Bazó Updated"
        }'    
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 239
        ETag: W/"ef-+h5Ev2dALvVipCh4DzgXbZ7Mbp4"
        Date: Fri, 11 Sep 2026 14:48:53 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Perfil actualizado correctamente","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com","avatarUrl":null,"createdAt":"2026-09-11T14:33:04.929Z"}}}
        ```
4. Subir Avatar (POST `/api/v1/users/avatar`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/users/avatar \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -F "avatar=@/home/bazop/projects/boilerplate-node-2026/temporal/img/img03.png"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 317
        ETag: W/"13d-QAeaRs0qRyanTdMMTUbhx6UQ+Os"
        Date: Sat, 12 Sep 2026 10:02:11 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar actualizado","data":{"user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com","avatarUrl":"http://minio:9000/app-uploads/avatars/user_bc29c571-acd1-4f15-9412-62cfd78c832e_1789207331804.png","createdAt":"2026-09-10T19:44:08.864Z"}}}
        ```
5. Eliminar Avatar (DELETE `/api/v1/users/avatar`):
    ```bash
    curl -i -X DELETE http://localhost:3000/api/v1/users/avatar \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 220
        ETag: W/"dc-l0CNaHN1DDNQ6G/Ec3V2oKceorg"
        Date: Sat, 12 Sep 2026 10:06:45 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar eliminado","data":{"user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com","avatarUrl":null,"createdAt":"2026-09-10T19:44:08.864Z"}}}
        ```
6. Guardar id de usuario:
    ```bash
    # Este es un id cualquier existente
    TARGET_USER_ID="14f33bf7-e8c4-488d-bef0-dbc2f828402c"
    ```
7. Subir / Reemplazar Avatar por ID (POST `/api/v1/users/:id/avatar`):
    ```bash
    curl -i -X POST "http://localhost:3000/api/v1/users/$TARGET_USER_ID/avatar" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -F "avatar=@/home/bazop/projects/boilerplate-node-2026/temporal/img/img03.png"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 348
        ETag: W/"15c-+1fGSa5zAD6d/yWw/sJuLuoL7wM"
        Date: Sat, 12 Sep 2026 12:44:02 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar de usuario actualizado","data":{"user":{"id":"14f33bf7-e8c4-488d-bef0-dbc2f828402c","name":"Emilio Piña Sisneros","email":"emilio.pinasisneros@hotmail.com","avatarUrl":"http://minio:9000/app-uploads/avatars/user_14f33bf7-e8c4-488d-bef0-dbc2f828402c_1789217042038.png","createdAt":"2026-09-10T19:44:37.296Z"}}}
        ```
8. Eliminar Avatar por ID (DELETE `/api/v1/users/:id/avatar`):
    ```bash
    curl -i -X DELETE "http://localhost:3000/api/v1/users/$TARGET_USER_ID/avatar" \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 251
        ETag: W/"fb-ATd7/p6oRhvdKsfLfdyg0lFnpL4"
        Date: Sat, 12 Sep 2026 12:46:12 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar de usuario eliminado","data":{"user":{"id":"14f33bf7-e8c4-488d-bef0-dbc2f828402c","name":"Emilio Piña Sisneros","email":"emilio.pinasisneros@hotmail.com","avatarUrl":null,"createdAt":"2026-09-10T19:44:37.296Z"}}}
        ```

### 🚀 Módulo de Gestión de Usuarios y Permisos
1. Intento de Lectura de Usuarios Sin Permisos (GET `/api/v1/users`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/users \
        -H "Authorization: Bearer $TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 403 Forbidden
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 100
        ETag: W/"64-vHCjCX/9IVbhi+hGyQqJAftVu0c"
        Date: Fri, 11 Sep 2026 14:52:18 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"fail","message":"No tienes el permiso necesario (users:read) para realizar esta acción"}
        ```
2. Intento de Acceso a Auditoría Sin Rol (GET `/api/v1/audit-logs`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/audit-logs \
        -H "Authorization: Bearer $TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 403 Forbidden
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 90
        ETag: W/"5a-KT9oi/x5iO4UaZkH7LH3zrb/hAk"
        Date: Fri, 11 Sep 2026 14:53:46 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"fail","message":"No tienes los permisos requeridos para ejecutar esta acción"}bazop@PetrixIesus:~/projects/boilerplate-node-2026$ 
        ```

### 🚀 Autenticación como Super Admin y Pruebas Administrativas
1. Login con Super Admin (POST `/api/v1/auth/login`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@boilerplate.com",
            "password": "tu_password_super_seguro"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 486
        ETag: W/"1e6-KR/OwvXav4Pyut+i4kI+dq7E0Q0"
        Date: Fri, 11 Sep 2026 15:00:56 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Inicio de sesión exitoso","data":{"user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","email":"admin@boilerplate.com","name":"Super Admin","avatarUrl":null,"roles":["SUPER_ADMIN"]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjMjljNTcxLWFjZDEtNGYxNS05NDEyLTYyY2ZkNzhjODMyZSIsImVtYWlsIjoiYWRtaW5AYm9pbGVycGxhdGUuY29tIiwicm9sZXMiOlsiU1VQRVJfQURNSU4iXSwiaWF0IjoxNzg5MTM4ODU2LCJleHAiOjE3ODk3NDM2NTZ9.4pH0s-JCausWXv5wJw0UEkm7G9JCf1MQfo4ieiTTqcA"}}
        ```
2. Guardar token del SUPER_ADMIN:
    ```bash
    ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjMjljNTcxLWFjZDEtNGYxNS05NDEyLTYyY2ZkNzhjODMyZSIsImVtYWlsIjoiYWRtaW5AYm9pbGVycGxhdGUuY29tIiwicm9sZXMiOlsiU1VQRVJfQURNSU4iXSwiaWF0IjoxNzg5MTM4ODU2LCJleHAiOjE3ODk3NDM2NTZ9.4pH0s-JCausWXv5wJw0UEkm7G9JCf1MQfo4ieiTTqcA"
    ```
3. Intento de Lectura de Usuarios Con Permisos (GET `/api/v1/users`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/users \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 2124
        ETag: W/"84c-4COdtHNi+vR/CwG30Cd7wJwWlUc"
        Date: Fri, 11 Sep 2026 15:05:18 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"users":[{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-11T14:33:04.929Z","roles":[]},{"id":"14f33bf7-e8c4-488d-bef0-dbc2f828402c","name":"Emilio Piña Sisneros","email":"emilio.pinasisneros@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"15a22d36-af2a-4d56-9a84-6bf31b5c455b","name":"María Corrales Ulibarri","email":"maria_corralesulibarri@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"21ecd189-f322-40a5-94be-e05563066538","name":"Rosario Negrón Alejandro","email":"rosario.negronalejandro63@yahoo.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"31caa5d2-6a4e-482f-bf76-bcf8ca44beae","name":"Manuel Reyes Paz","email":"manuel_reyespaz@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"4ad334ff-1069-4ef3-a973-5a6ea89c6ec5","name":"Lilia Godoy Sedillo","email":"lilia.godoysedillo12@gmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"6ba4cc7d-c615-4bc2-ac7a-ef1c0683ed44","name":"Rodrigo Cervantes Bernal","email":"rodrigo_cervantesbernal@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"70698dcc-a52d-424e-8ff1-9efde9814979","name":"Gonzalo Vallejo Domínguez","email":"gonzalo.vallejodominguez42@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"71901a46-1793-4cfb-8b54-9f81a4dd12dd","name":"Antonia Alcalá Santana","email":"antonia.alcalasantana56@gmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"7fd8ca82-10ad-4acb-a4c4-7843cdf5fad7","name":"Sancho Aguayo Delgadillo","email":"sancho_aguayodelgadillo@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]}],"pagination":{"total":27,"page":1,"totalPages":3}}}
        ```
4. Intento de Acceso a Auditoría Con Rol (GET `/api/v1/audit-logs`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/audit-logs \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 3647
        ETag: W/"e3f-g14LSGLcunhIohSZBX2dPNfrBHo"
        Date: Fri, 11 Sep 2026 15:07:12 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"logs":[{"id":"18792b52-1562-40c3-8f89-9872693e817b","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"LOGIN_SUCCESS","entity":"Auth","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"ip\":\"::ffff:172.19.0.1\",\"userAgent\":\"curl/8.5.0\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T15:00:56.656Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"4a2a5918-33cb-4ff3-98e4-d0585e3d9a97","userId":"9ec12865-9968-4148-9f23-427c062b61ad","action":"UPDATE_USER","entity":"User","entityId":"9ec12865-9968-4148-9f23-427c062b61ad","details":"{\"name\":\"Pedro Bazó Updated\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-11T14:48:53.522Z","user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com"}},{"id":"214e95ff-d682-4edf-8b11-bb96a09cab87","userId":"9ec12865-9968-4148-9f23-427c062b61ad","action":"LOGIN_SUCCESS","entity":"Auth","entityId":"9ec12865-9968-4148-9f23-427c062b61ad","details":"{\"ip\":\"::ffff:172.19.0.1\",\"userAgent\":\"curl/8.5.0\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T14:35:58.517Z","user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com"}},{"id":"dc1eb351-2ace-4de2-9c0e-fdfa3b0425f9","userId":null,"action":"CREATE_USER","entity":"User","entityId":"9ec12865-9968-4148-9f23-427c062b61ad","details":"{\"email\":\"test@example.com\",\"password\":\"[PROTECTED]\",\"name\":\"Pedro Bazó\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-11T14:33:04.943Z","user":null},{"id":"2e293d04-4fc5-4236-accb-8ea33de95c6e","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"LOGIN_SUCCESS","entity":"Auth","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"ip\":\"::ffff:172.19.0.1\",\"userAgent\":\"curl/8.5.0\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T11:17:57.856Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"6054581f-ec57-45f0-be98-fc2c9a29aa86","userId":null,"action":"LOGIN_FAILED","entity":"Auth","entityId":null,"details":"{\"email\":\"admin@boilerplate.com\",\"reason\":\"Contraseña incorrecta\",\"ip\":\"::ffff:172.19.0.1\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T11:14:35.640Z","user":null},{"id":"b240b81c-76be-44c3-a481-a9c20a6e5c01","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"LOGIN","entity":"Auth","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"message\":\"Inicio de sesión exitoso\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-10T19:45:14.435Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"9ba5cd18-1972-48e6-bf2e-c940cebdf7a2","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"UPDATE","entity":"User","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"field\":\"email\",\"old\":\"old@test.com\",\"new\":\"admin@boilerplate.com\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-10T19:45:14.435Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"0e1df34c-fe80-49f0-8daa-6cbe8b451bc9","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"CREATE","entity":"Person","entityId":"1","details":"{\"name\":\"Juan Pérez\",\"role\":\"Padre\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-10T19:45:14.435Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}}],"pagination":{"total":9,"page":1,"totalPages":1}}}
        ```
5. Crear Usuario Admin (POST `/api/v1/users`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/users \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "nuevo.usuario@example.com",
            "password": "Password123!",
            "name": "Carlos Gómez"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 180
        ETag: W/"b4-vYvuxiteRQ1SAiG2U2YnEPUTJjE"
        Date: Sat, 12 Sep 2026 09:29:40 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"user":{"id":"47372aff-6ada-4220-a01e-cb9ec281de29","email":"nuevo.usuario@example.com","name":"Carlos Gómez","createdAt":"2026-09-12T09:29:40.219Z"}}}
        ```
6. Actualizar Usuario (PUT `/api/v1/users/:id`):
    ```bash
    curl -i -X PUT http://localhost:3000/api/v1/users/47372aff-6ada-4220-a01e-cb9ec281de29 \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Carlos Gómez Editado",
            "isActive": true
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express        
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 284
        ETag: W/"11c-YKLWFCgSequAQ4PoiWp/zEENhMY"
        Date: Sat, 12 Sep 2026 09:37:57 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Usuario actualizado correctamente","data":{"user":{"id":"47372aff-6ada-4220-a01e-cb9ec281de29","name":"Carlos Gómez Editado","email":"nuevo.usuario@example.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-12T09:29:40.219Z","roles":["USER"]}}}
        ```

### 🚀 Módulo de Gestión de Roles y Permisos
1. Consultar Roles Existentes (GET `/api/v1/roles`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/roles \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 577
        ETag: W/"241-xSvZ1d0OWFMkMeGknKjDIQPAWHc"
        Date: Fri, 11 Sep 2026 15:12:32 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"roles":[{"id":"2701bb42-a714-4b26-8062-792723b455fc","name":"ADMIN","description":"Administrador de contenido y usuarios","userCount":0,"permissions":[],"createdAt":"2026-09-10T19:44:08.753Z"},{"id":"a4c6a0e4-c473-4102-a4ee-ee2325170bfd","name":"SUPER_ADMIN","description":"Acceso total y gestión del sistema","userCount":1,"permissions":[],"createdAt":"2026-09-10T19:44:08.661Z"},{"id":"eda3eeb3-108f-4465-9490-d3fc773abe35","name":"USER","description":"Usuario estándar","userCount":0,"permissions":[],"createdAt":"2026-09-10T19:44:08.765Z"}]}
        ```
2. Crear un Nuevo Rol (POST `/api/v1/roles`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/roles \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "EDITOR",
            "description": "Rol con permisos de edición de contenido"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 270
        ETag: W/"10e-29mvH3/Bg6KB7ekdBWeyqAaeUaA"
        Date: Fri, 11 Sep 2026 15:13:54 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Rol creado exitosamente","data":{"role":{"id":"6351d2d9-f0bd-4ef0-be4e-f1b91215d2b4","name":"EDITOR","description":"Rol con permisos de edición de contenido","createdAt":"2026-09-11T15:13:54.158Z","updatedAt":"2026-09-11T15:13:54.158Z"}}}bazop@PetrixIesus:~/projects/boilerplate-node-2026$ 
        ```
3. Consultar Permisos Existentes (GET `/api/v1/roles/permissions`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/roles/permissions \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 2055
        ETag: W/"807-KFqX1eBBYdnSUIVJCaamTeuVHgI"
        Date: Sat, 12 Sep 2026 13:48:55 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"permissions":[{"id":"55432b21-be17-48c2-a70c-032b71a0abb3","action":"admin:access","module":"admin","description":"Permite acceder al panel de administración","createdAt":"2026-09-12T13:44:35.831Z"},{"id":"f81bb368-26ca-453c-a535-b4211d72695a","action":"audit:read","module":"audit","description":"Permite ver el historial de auditoría y actividades","createdAt":"2026-09-12T13:44:35.885Z"},{"id":"29964da3-5596-4bf3-a7f8-c53ab3e632c5","action":"roles:create","module":"roles","description":"Permite crear nuevos roles","createdAt":"2026-09-12T13:44:35.865Z"},{"id":"4f6d24a7-d44b-434b-b8c1-de62465cabc7","action":"roles:delete","module":"roles","description":"Permite eliminar roles","createdAt":"2026-09-12T13:44:35.878Z"},{"id":"470a7381-25e7-4c0b-a29e-8d5080446d5a","action":"roles:read","module":"roles","description":"Permite ver lalista de roles y sus permisos","createdAt":"2026-09-12T13:44:35.860Z"},{"id":"94512c45-b397-45a4-ac6c-e463ba4c69f0","action":"roles:update","module":"roles","description":"Permite modificar roles y asignar permisos","createdAt":"2026-09-12T13:44:35.870Z"},{"id":"af557cb8-24ea-42c9-b498-7b2e14fce236","action":"system:logs:read","module":"system","description":"Permite consultar logs técnicos del servidor y la base de datos","createdAt":"2026-09-12T13:44:35.889Z"},{"id":"96321d6f-9a44-4777-bfba-68c1b49a81d9","action":"users:create","module":"users","description":"Permite registrar nuevos usuarios","createdAt":"2026-09-12T13:44:35.845Z"},{"id":"fda4b531-15a3-41b6-ad1c-4d054c72b357","action":"users:delete","module":"users","description":"Permite eliminar usuarios","createdAt":"2026-09-12T13:44:35.854Z"},{"id":"14164c6b-2abb-434d-be97-0fad2a97a678","action":"users:read","module":"users","description":"Permite ver el listado y detalle de usuarios","createdAt":"2026-09-12T13:44:35.839Z"},{"id":"e8ccff77-5a83-4ba4-a029-4a39b4bbfc61","action":"users:update","module":"users","description":"Permite editar datos de usuarios existentes","createdAt":"2026-09-12T13:44:35.850Z"}]}}
        ```

### 🚀 Asignación de Roles a un Usuario y Limpieza
1. Asignar el nuevo rol EDITOR al usuario de prueba (PUT `/api/v1/users/:id/roles`):
    ```bash
    curl -i -X PUT http://localhost:3000/api/v1/users/9ec12865-9968-4148-9f23-427c062b61ad/roles \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "roles": ["USER", "EDITOR"]
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 65
        ETag: W/"41-pe0mynh+sz1rYl3PdbcIF+I9324"
        Date: Fri, 11 Sep 2026 18:38:10 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Roles actualizados correctamente"}
        ```
2. Eliminar el Rol de Prueba (DELETE `/api/v1/roles/:id`):
    ```bash
    curl -i -X DELETE http://localhost:3000/api/v1/roles/6351d2d9-f0bd-4ef0-be4e-f1b91215d2b4 \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 60
        ETag: W/"3c-L6eA4rBc4UKuCPVzwRH4ZHQbBF8"
        Date: Fri, 11 Sep 2026 18:44:55 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Rol eliminado correctamente"}
        ```
3. Eliminar Usuario de Prueba (DELETE `/api/v1/users/:id`):
    ```bash
    curl -i -X DELETE http://localhost:3000/api/v1/users/9ec12865-9968-4148-9f23-427c062b61ad \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 64
        ETag: W/"40-m85pJrkJ/TZLobmd+w1fnn6BWZo"
        Date: Fri, 11 Sep 2026 18:47:47 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Usuario eliminado correctamente"}
        ```


## 💻 Desarrollo del Frontend

### 📦 Paso 1: Instalación de Dependencias
+ Instalamos Axios para las peticiones HTTP y el plugin oficial de Tailwind CSS v4 para Vite entre otras:
    ```bash
     # Instalar cliente HTTP
    npm install axios

     # Instalar Tailwind CSS v4 y su integración con Vite
    npm install -D tailwindcss @tailwindcss/vite

     # Sweet Alert 2
    npm install sweetalert2

     # Hero icons for Vue.js
    npm install @heroicons/vue

     # Flatpickr
    npm install flatpickr
    ```

### ⚙️ Paso 3: Configuración de Vite y Tailwind v4

## --------------------------------------------------------



1. Abre el archivo `vite.config.js` déjalo exactamente así:
    ```js
    import { fileURLToPath, URL } from 'node:url'
    import { defineConfig } from 'vite'
    import vue from '@vitejs/plugin-vue'
    import tailwindcss from '@tailwindcss/vite'

    export default defineConfig({
        plugins: [
            vue(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    })
    ```
2. Abre el archivo `src/assets/main.css` (o `src/style.css`), borra todo lo que tenga dentro y deja únicamente esta línea:
    ```css
    @import "tailwindcss";
    
    /* Asegura que la raíz ocupe siempre al menos el 100% de la ventana */
    html,
    body,
    #app {
        min-height: 100vh;
        min-height: 100dvh; /* Soporte dinámico para navegadores modernos */
        margin: 0;
        padding: 0;
        background-color: #0f172a; /* Reemplaza por el color oscuro base de tu tema (ej. slate-900) */
        color: #f8fafc;
    }
    ```
    + Si existe el archivo `src/assets/base.css`, puedes borrarlo o vaciarlo para que no interfiera con las clases de Tailwind.

## --------------------------------------------------------






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
