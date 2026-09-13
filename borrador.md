## Crear el Helper de IP y Contexto
### Auditoria para eventos de usuarios y autenticación
3. Actualización de `src/app.js`:
    + Importa `setAuditUser` y regístralo globalmente antes de las rutas de la API:
        ```js
        const express = require('express');
        const cors = require('cors');
        require('dotenv').config();

        // Middlewares
        const { setAuditUser } = require('./middlewares/auditContext.middleware');  // <- Nuevo middleware para establecer el contexto de auditoría

        // ...

        app.use(cors({
            // ...
        }));
        app.use(express.json());

        // Contexto de auditoría global para envolver la petición HTTP
        app.use(setAuditUser);  // <- Nuevo middleware para establecer el contexto de auditoría 

        // ...
        ```

### Auditoria para eventos de sistemas
#### Paso 2: Registrar el Middleware y Capturadores Globales en Express
1. En tu archivo principal `src/app.js`, conecta el middleware al final de todas tus rutas. Agrega también los eventos de proceso para fallos fuera del ciclo HTTP:
    ```js
    const express = require('express');
    const cors = require('cors');
    require('dotenv').config();

    // Middleware para establecer el contexto de auditoría
    const { setAuditUser } = require('./middlewares/auditContext.middleware');
    // Middleware para manejo global de errores de sistema
    const { errorHandler } = require('./middlewares/error.middleware');             // <- Nuevo

    // Rutas
    const authRoutes = require('./routes/auth.routes');
    const adminRoutes = require('./routes/admin.routes');
    // ...
    /* Inicio nuevo bloque */
    // --- MANEJO DE ERRORES GLOBALES (Debe ser el último app.use) ---
    app.use(errorHandler);

    // --- CAPTURA DE ERRORES FUERA DEL CICLO HTTP ---
    process.on('unhandledRejection', (reason) => {
        console.error('🔥 [CRITICAL] Promesa no capturada (unhandledRejection):', reason);
    });

    process.on('uncaughtException', (error) => {
        console.error('🔥 [CRITICAL] Excepción no controlada (uncaughtException):', error);
    });
    /* Fin nuevo bloque */

    // Inicialización del Servidor
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        console.log(`📌 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
    ```
3. Probar funcionamiento:
    + Agregar el siguiente endpoint en `familytree2026-backend/src/app.js`:
        ```js
        // Ruta temporal para probar captura de errores
        app.get('/api/v1/test-error', async (req, res) => {
            // Simulamos un error no controlado (ej. propiedad indefinida)
            const nullObject = null;
            nullObject.triggerError(); 
        });        
        ```
    + Ejecutar:
        ```bash
        curl http://localhost:4000/api/v1/test-error
        ```



## Habilitar CORS Dinámico 
### En el backend (`src/app.js`)
1. Modificar `src/app.js`:
    ```js
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
    ```




## -------------------------


## -------------------------


### Url

#### Frontend
1. Home:
    + Dev:  `http://localhost:5173`
    + Prod: `https://familytree2026.vercel.app`
2. Prueba de Registro:
    + Dev:  `http://localhost:5173/register`
    + Prod: `https://familytree2026.vercel.app/register`
3. Prueba de Vista Protegida:
    + Dev:  `http://localhost:5173/dashboard`
    + Prod: `https://familytree2026.vercel.app/dashboard`
4. Prueba de Rehidratación de Sesión (Persistence):
    + Presiona F5 (Recargar página). El Navigation Guard debe ejecutar `fetchUser()`, validar el token contra el endpoint GET `/me` y mantenerte en `/dashboard` sin cerrar tu sesión.
5. Prueba de Cierre de Sesión:
    + Haz clic en el botón Cerrar Sesión. Debe limpiar el localStorage, borrar el usuario de Pinia y redirigirte a `/login`.
6. Prueba de Protección de Rutas:
    + Estando deslogueado, intenta escribir manualmente `http://localhost:5173/dashboard` en la barra de direcciones. El Navigation Guard debe rebotarte de inmediato a `/login`.


