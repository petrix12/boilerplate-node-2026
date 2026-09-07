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
    + Ubicados en la carpeta familytree2026-backend, inicializamos el paquete de Node.js e instalamos el conjunto de librerías necesarias:
        ```bash
        # 1. Navegar al directorio del backend
        cd ~/projects/boilerplate-node-2026

        # 2. Crear el directorio para el Backend y entrar en el
        mkdir backend
        cd backend

        # 2. Inicializar package.json
        npm init -y

        # 3. Instalar dependencias de producción
        npm install express @prisma/client @prisma/adapter-pg pg bcryptjs jsonwebtoken dotenv cors multer @aws-sdk/client-s3 @supabase/supabase-js express-validator

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
        @supabase/supabase-js	| Producción    | SDK para interactuar con la infraestructura y almacenamiento de Supabase.
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
4. Actualizar `backend/package.json`
    ```json
    {
        "name": "backend",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "start": "node src/server.js",
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
5. Crear archivo de variables de entorno `backend/.env`:
    ```env
    # ==========================================
    # CONFIGURACIÓN DEL SERVIDOR BACKEND LOCAL
    # ==========================================
    PORT=3000
    APP_URL=http://localhost:3000
    NODE_ENV=development

    # ==========================================
    # CONFIGURACIÓN DEL SERVIDOR BACKEND PRODUCCIÓN
    # ==========================================
    # PORT=3000
    # APP_URL=https://api.tudominio.com
    # NODE_ENV=production
    ```
6. Crear `backend/.gitignore`:
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
7. Crea el archivo `backend/src/server.js`:
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
8. Prueba la ejecución:
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

        # Crear el proyecto Vue 3 (o dentro de familytree2026-frontend)
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

3. Una vez creado, navegamos al directorio e instalamos las dependencias base generadas por Vue:
    ```bash    
    npm install
    ```
    + En caso de error, ejecutar:
    ```bash
    npm install --legacy-peer-deps
    ```
4. Prueba la ejecución:
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





## --------------------------------------------------------



#### Paso 2: Crear el Orquestador de Infraestructura Local (docker-compose.yml)
+ En la raíz del proyecto (`mi-proyecto-starter/`), crea el archivo `docker-compose.yml`:
```yml
services:
  postgres_dev:
    image: postgres:15-alpine
    container_name: local_starter_postgres
    restart: always
    environment:
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: local_starter_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  minio:
    image: minio/minio:RELEASE.2024-01-18T22-51-28Z
    container_name: local_starter_minio
    restart: always
    ports:
      - "9000:9000"   # Puerto de la API S3
      - "9001:9001"   # Consola Web
    environment:
      MINIO_ROOT_USER: minio_admin
      MINIO_ROOT_PASSWORD: minio_password123
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  minio_data:
```

+ Crea también un archivo `.gitignore` en la raíz para evitar subir archivos temporales o volúmenes accidentales:
    ```gitignore
    # Docker / Datos locales
    .postgres_data/
    *.log

    # Archivos de entorno
    .env
    .env.local
    ```

#### Paso 3: Inicializar la Base de Datos Local
+ Ejecuta el siguiente comando en la raíz para levantar el contenedor de PostgreSQL en segundo plano:
```bash
docker compose up -d
```

+ Verificación del Servicio:
    + Para confirmar que la base de datos está activa y escuchando en el puerto 5432:
        ```bash
        docker ps
        ```
    + Deberías ver el contenedor local_starter_postgres con estado Up.



## --------------------------------------------------------









