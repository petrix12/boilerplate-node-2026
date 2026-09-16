[🔙](index.md)
---
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
        source     String   @default("BACKEND") // BACKEND, FRONTEND, DATABASE
        level      String   @default("ERROR")   // ERROR, WARN, INFO, CRITICAL
        message    String   @db.Text
        stackTrace String?  @db.Text
        path       String?
        method     String?
        statusCode Int?     @default(500)
        userId     String?
        context    Json?    // Información contextual extra (IP, navegador, payload de error, etc.)
        createdAt  DateTime @default(now())

        @@index([source])
        @@index([level])
        @@index([createdAt])
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
    const { auditStorage } = require('../middlewares/auditContext.middleware');
    require('dotenv').config();

    // Inicialización estándar y nativa de Prisma Client
    const prismaRaw = new PrismaClient();

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
2. Crear el Servicio de Ingesta (`backend/src/services/systemLog.service.js`):
    ```js
    const prisma = require('../config/prisma');

    const systemLogService = {
        /**
        * Registra un error o advertencia en la tabla SystemLog
        */
        async log({
            source = 'BACKEND',
            level = 'ERROR',
            message,
            stackTrace = null,
            path = null,
            method = null,
            statusCode = 500,
            userId = null,
            context = null,
        }) {
            try {
                return await prisma.systemLog.create({
                    data: {
                        source,
                        level,
                        message: message ? String(message) : 'Mensaje no especificado',
                        stackTrace: stackTrace ? String(stackTrace) : null,
                        path,
                        method,
                        statusCode: parseInt(statusCode, 10) || 500,
                        userId,
                        context: context ? context : undefined,
                    },
                });
            } catch (error) {
                // Evitamos que un error guardando el log detenga la aplicación
                console.error('[SYSTEM LOG ERROR]: No se pudo guardar el log en DB:', error.message);
            }
        },
    };

    module.exports = systemLogService;    
    ```
    + Crearemos un servicio dedicado para interactuar con la tabla SystemLog de manera asíncrona y segura (para que un fallo guardando un log jamás interrumpa la petición principal).
3. Crear el Servicio de Limpieza (`backend/src/services/cron.service.js`):
    ```js
    const prisma = require('../config/prisma');

    const cleanupOldLogs = async () => {
        try {
            const retentionDays = parseInt(process.env.LOG_RETENTION_DAYS, 10) || 30;
            
            // Calcular fecha límite
            const limitDate = new Date();
            limitDate.setDate(limitDate.getDate() - retentionDays);

            const result = await prisma.systemLog.deleteMany({
                where: {
                    createdAt: {
                        lt: limitDate,
                    },
                },
            });

            if (result.count > 0) {
                console.log(`[CLEANUP CRON]: Se eliminaron ${result.count} logs antiguos con más de ${retentionDays} días.`);
            }
        } catch (error) {
            console.error('[CLEANUP CRON ERROR]: Error al purgar logs antiguos:', error.message);
        }
    };

    const initSystemCleanup = () => {
        // Ejecutar una vez al arrancar el servidor (opcional)
        cleanupOldLogs();

        // Programar la ejecución cada 24 horas (24 * 60 * 60 * 1000 ms)
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        setInterval(cleanupOldLogs, TWENTY_FOUR_HOURS);

        console.log('[CLEANUP CRON]: Servicio de purga automática de logs inicializado.');
    };

    module.exports = { initSystemCleanup, cleanupOldLogs };    
    ```
4. Crear el Agregador (`backend/src/services/diagnosticAggregator.service.js`):
    ```js
    const prisma = require('../config/prisma');

    const diagnosticAggregatorService = {
        /**
        * Recopila y resume los datos clave del sistema para la IA
        */
        async getSystemDiagnosticData() {
            try {
                const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

                // 1. Conteo de logs de sistema (últimas 24h) agrupados por fuente y nivel
                const systemLogsSummary = await prisma.systemLog.groupBy({
                    by: ['source', 'level'],
                    where: {
                        createdAt: { gte: twentyFourHoursAgo }
                    },
                        _count: {
                        id: true
                    }
                });

                // 2. Obtener los últimos 10 errores más críticos o recientes del sistema
                const recentErrors = await prisma.systemLog.findMany({
                    where: {
                        createdAt: { gte: twentyFourHoursAgo }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    select: {
                        source: true,
                        level: true,
                        message: true,
                        path: true,
                        statusCode: true,
                        createdAt: true
                    }
                });

                // 3. Resumen de auditoría de seguridad (Intentos de login, accesos, etc. últimas 24h)
                const auditLogsSummary = await prisma.auditLog.groupBy({
                    by: ['action', 'entity'],
                    where: {
                        createdAt: { gte: twentyFourHoursAgo }
                    },
                    _count: {
                        id: true
                    },
                    orderBy: {
                        _count: { id: 'desc' }
                    },
                    take: 5
                });

                // 4. Métricas generales del servidor y DB
                const dbStatus = 'Connected'; // Si llegó aquí, la BD responde
                const totalUsers = await prisma.user.count();
                const activeUsers = await prisma.user.count({ where: { isActive: true } });

                return {
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV || 'development',
                    infrastructure: {
                        backend: 'Node.js / Express (Docker)',
                        database: `PostgreSQL (${dbStatus})`,
                        frontend: 'Vite / Vue / SPA'
                    },
                    metrics: {
                        totalUsers,
                        activeUsers
                    },
                    systemLogsSummary,
                    recentErrors,
                    auditLogsSummary
                };
            } catch (error) {
                console.error('[DIAGNOSTIC AGGREGATOR ERROR]:', error.message);
                throw new Error('No se pudo recopilar el diagnóstico del sistema');
            }
        }
    };

    module.exports = diagnosticAggregatorService;    
    ```
5. Crear el Servicio de IA Adaptativo (`backend/src/services/ai.service.js`):
    ```js
    const diagnosticAggregatorService = require('./diagnosticAggregator.service');

    const aiService = {
        /**
        * Genera el diagnóstico del sistema utilizando la IA configurada (Groq)
        */
        async generateSystemDiagnostic() {
            const provider = process.env.AI_PROVIDER || 'groq';
            const apiKey = process.env.AI_API_KEY;
            const model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

            if (!apiKey) {
                throw new Error('La clave de API de IA (AI_API_KEY) no está configurada en el entorno.');
            }

            // 1. Recopilar datos estructurados del agregador
            const rawData = await diagnosticAggregatorService.getSystemDiagnosticData();

            // 2. Construir el prompt de sistema y usuario
            const systemPrompt = `
                Eres un Arquitecto de Software Senior y Especialista en DevOps y Ciberseguridad. 
                Tu objetivo es analizar los datos de diagnóstico y auditoría de una aplicación web (Node.js, Express, PostgreSQL, Vue 3) y emitir un informe técnico claro, profesional y directo en formato JSON estrictamente válido.
                
                Debes evaluar:
                - Estado del backend.
                - Estado del frontend.
                - Estado de la base de datos.
                - Estado global de la aplicación.
                - Estado de seguridad (analizando auditorías e intentos sospechosos).
                - Recomendaciones prácticas (comandos de consola, optimizaciones de BD, parches de seguridad).

                Responde ÚNICAMENTE con un objeto JSON válido que contenga la siguiente estructura exacta:
                {
                    "backendStatus": "healthy | warning | critical",
                    "frontendStatus": "healthy | warning | critical",
                    "databaseStatus": "healthy | warning | critical",
                    "globalStatus": "healthy | warning | critical",
                    "securityStatus": "secure | suspicious | compromised",
                    "summary": "Resumen ejecutivo breve en lenguaje humano",
                    "details": {
                        "backend": "Análisis detallado del backend...",
                        "frontend": "Análisis detallado del frontend...",
                        "database": "Análisis detallado de la base de datos...",
                        "security": "Análisis detallado de seguridad y auditoría..."
                    },
                    "recommendations": [
                        "Acción 1 recomendada...",
                        "Acción 2 recomendada..."
                    ]
                }
            `;

            const userPayload = JSON.stringify(rawData, null, 2);

            // 3. Seleccionar proveedor y ejecutar petición (Patrón Strategy / Adaptador)
            if (provider === 'groq') {
                return await this._callGroqAPI(apiKey, model, systemPrompt, userPayload);
            } else {
                throw new Error(`El proveedor de IA '${provider}' no está soportado actualmente.`);
            }
        },

        /**
        * Adaptador específico para Groq Cloud usando Fetch nativo
        */
        async _callGroqAPI(apiKey, model, systemPrompt, userPayload) {
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: `Analiza los siguientes datos del sistema:\n${userPayload}` }
                        ],
                        response_format: { type: 'json_object' }, // Forzar respuesta JSON limpia
                        temperature: 0.2, // Baja temperatura para análisis técnico objetivo
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`Error en API de Groq (${response.status}): ${errorData}`);
                }

                const data = await response.json();
                const content = data.choices[0]?.message?.content;

                return JSON.parse(content);
            } catch (error) {
                console.error('[AI SERVICE ERROR]:', error.message);
                throw new Error(`Fallo al generar el diagnóstico con IA: ${error.message}`);
            }
        },
    };

    module.exports = aiService;    
    ```

### 🎮 Paso 7: Controladores de la API (`src/controllers/`)
+ Implementa la capa de orquestación de respuesta para cada dominio:
1. `backend/src/controllers/auth.controller.js`: Login, registro, cambio de contraseña y refresco de tokens:
    ```js
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const prisma = require('../config/prisma');
    const { getClientIp } = require('../utils/request.utils');

    const generateToken = (user, roles = [], permissions = []) => {
        return jwt.sign(
            { id: user.id, email: user.email, roles, permissions },
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
                },
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

            // Extraer lista plana de permisos sin duplicados
            const permissionsSet = new Set();
            user.roles.forEach((ur) => {
                if (ur.role && ur.role.permissions) {
                    ur.role.permissions.forEach((rp) => {
                        if (rp.permission && rp.permission.action) {
                            permissionsSet.add(rp.permission.action);
                        }
                    });
                }
            });
            const userPermissions = Array.from(permissionsSet);

            const token = generateToken(user, userRoles, userPermissions);

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
                    user: { 
                        id: user.id, 
                        email: user.email, 
                        name: user.name, 
                        avatarUrl: user.avatarUrl, 
                        roles: userRoles, 
                        permissions: userPermissions 
                    },
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

            if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

            const userRoles = user.roles.map((ur) => ur.role.name);

            const permissionsSet = new Set();
            user.roles.forEach((ur) => {
                if (ur.role && ur.role.permissions) {
                    ur.role.permissions.forEach((rp) => {
                        if (rp.permission && rp.permission.action) {
                            permissionsSet.add(rp.permission.action);
                        }
                    });
                }
            });
            const userPermissions = Array.from(permissionsSet);

            // Evaluar si la IA está habilitada comprobando la variable de entorno
            const isAiEnabled = !!process.env.AI_API_KEY && process.env.AI_API_KEY.trim() !== '';        

            return res.status(200).json({
                status: 'success',
                data: { 
                    user: { 
                        id: user.id, 
                        email: user.email, 
                        name: user.name, 
                        avatarUrl: user.avatarUrl, 
                        roles: userRoles, 
                        permissions: userPermissions,
                        createdAt: user.createdAt 
                    },
                    features: {
                        aiDiagnostic: isAiEnabled
                    }
                },
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
6. `backend/src/controllers/systemLog.controller.js`: Recibirá los errores capturados en el cliente/frontend y los pasará al servicio:
    ```js
    const systemLogService = require('../services/systemLog.service');

    const ingestFrontendLog = async (req, res) => {
        try {
            const { level = 'ERROR', message, stackTrace, path, context } = req.body;

            if (!message) {
                return res.status(400).json({ message: 'El mensaje del log es obligatorio' });
            }

            await systemLogService.log({
                source: 'FRONTEND',
                level,
                message,
                stackTrace,
                path,
                statusCode: null,
                userId: req.user?.id || null, // Opcional si la ruta pasa por auth
                context: {
                    ...context,
                    userAgent: req.headers['user-agent'],
                    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                },
            });

            return res.status(201).json({ status: 'success', message: 'Log registrado' });
        } catch (error) {
            console.error('Error al ingerir log de frontend:', error);
            return res.status(500).json({ message: 'Error interno al procesar el log' });
        }
    };

    module.exports = { ingestFrontendLog };    
    ```
7. `backend/src/controllers/diagnostic.controller.js`: Controlador de Diagnóstico:
    ```js
    const aiService = require('../services/ai.service');

    const getSystemDiagnostic = async (req, res, next) => {
        try {
            const diagnosticReport = await aiService.generateSystemDiagnostic();

            return res.status(200).json({
                status: 'success',
                data: diagnosticReport,
            });
        } catch (error) {
            console.error('Error al generar diagnóstico del sistema:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Error interno al generar el diagnóstico de IA',
            });
        }
    };

    module.exports = {
        getSystemDiagnostic,
    };    
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
    const { authenticateJWT, checkPermission } = require('../middlewares/auth.middleware');

    router.use(authenticateJWT);

    // Permite el acceso a cualquiera que posea el permiso audit:read
    router.get('/', checkPermission('audit:read'), getAuditLogs);

    module.exports = router;
    ```
5. `backend/src/routes/systemLog.routes.js`: Definir la Ruta de Ingesta:
    ```js
    const express = require('express');
    const router = express.Router();
    const { ingestFrontendLog } = require('../controllers/systemLog.controller');
    const { authenticateJWT } = require('../middlewares/auth.middleware');

    // Ingesta pública o semi-protegida para errores del cliente
    // Nota: Usamos un middleware opcional o authenticateJWT según si permites logs de usuarios no autenticados.
    router.post('/ingest', ingestFrontendLog);

    module.exports = router;    
    ```
6. `backend/src/routes/diagnostic.routes.js`: Rutas de Diagnóstico:
    ```js
    const express = require('express');
    const router = express.Router();
    const { getSystemDiagnostic } = require('../controllers/diagnostic.controller');
    const { authenticateJWT, checkPermission } = require('../middlewares/auth.middleware'); // O tu middleware de permisos correspondiente

    // Protegido con JWT y opcionalmente permisos de sistema/admin
    router.use(authenticateJWT);

    // GET /api/v1/diagnostics/system
    router.get('/system', getSystemDiagnostic);

    // O si usas control de permisos estricto:
    // router.get('/system', checkPermission('system:read'), getSystemDiagnostic);

    module.exports = router;    
    
    ```
7. `backend/src/routes/index.js`: Router central que registra todos los módulos:
    ```js
    const express = require('express');
    const router = express.Router();

    const authRoutes = require('./auth.routes');
    const userRoutes = require('./user.routes');
    const roleRoutes = require('./role.routes');
    const auditRoutes = require('./audit.routes');
    const systemRoutes = require('./systemLog.routes');
    const diagnosticRoutes = require('./diagnostic.routes');

    // Definición limpia de módulos
    router.use('/auth', authRoutes);
    router.use('/users', userRoutes);
    router.use('/roles', roleRoutes);
    router.use('/audit-logs', auditRoutes);
    router.use('/system-logs', systemRoutes);
    router.use('/diagnostics', diagnosticRoutes);

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
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL_LOCAL_VITE,
        process.env.FRONTEND_URL_LOCAL_VUE_CLI,
    ].filter(Boolean);

    app.use(cors({
        origin: (origin, callback) => {
            // 1. En entorno de desarrollo permitimos cualquier petición para facilitar las pruebas
            if (process.env.NODE_ENV === 'development') {
                return callback(null, true);
            }

            // 2. En producción o staging se valida estrictamente contra allowedOrigins
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            callback(new Error('No permitido por CORS'));
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

    // Inicializar el Servicio de Limpieza de Logs Antiguos
    const { initSystemCleanup } = require('./services/cron.service');
    initSystemCleanup();

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
---
[🔙](index.md)