## 💻 Estructuración Local y Control de Versiones (Git & GitHub)
+ Esta sección documenta el procedimiento estándar para organizar el espacio de trabajo local, levantar la infraestructura de desarrollo mediante Docker y vincular los proyectos con repositorios remotos en GitHub.

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
    ```ini
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
    ```text
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

#### Paso 4: Crear estructura de proyecto de documentación inicial
1. Inicializar `VitePress` dentro de la carpeta principal del monorepo:
    ```bash
    npm init vitepress@latest
    ```
    + Project name: › docs
2. Entrar, hacer el `npm install` y probar el `npm run dev` para validar que todo vuela con Vite.


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

