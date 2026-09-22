# A mano
---

## --------------------------------------------------------        
## 📱 Credenciales en Redes Sociales
### GitHub
### Microsoft (Microsoft Entra ID / Outlook / Azure).
### Apple (Sign in with Apple).
### Meta (Facebook Login) / Instagram.
### X (antes Twitter) / LinkedIn.


## -------------------------------
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
        ```bash
        docker compose exec backend npx prisma migrate reset --force
        # o en su forma definida en el package.json
        docker compose exec backend npm run db:reset
        ```
    + Evitar el inicio de un contenedor:
        ```bash
        docker update --restart=no nombre_contenedor
        ```
2. **Ubuntu**:
    + Ver estructura de carpetas sin las carpetas node_modules ni archivo ocultos
        ```bash
        tree --dirsfirst -I "node_modules|vendor|.git|temporal|uploads|migrations|borrador.md"
        ```
        + Instalación de tree en sistemas basados en Red Hat / Fedora / CentOS:
            ```bash
            sudo apt update && sudo apt install tree
            ```

## Tares
### Pendientes
+ ◻️ Recuperar credenciales (¿Olvidó su password?).
+ ◻️ Establecer politicas de seguridad en tablas de base de datos de supabase.
+ ◻️ Multi-idiomas.
+ ◻️ Solicitar autenticación de email.
+ ◻️ Revisar la seguridad del backend.
+ ◻️ Seguridad y Hardening HTTP (Backend): helmet para configurar cabeceras HTTP seguras. | 
+ ◻️ Seguridad y Hardening HTTP (Backend): express-rate-limit para prevención de ataques de fuerza bruta en rutas críticas (/login, /register, /forgot-password).
+ ◻️ Seguridad y Hardening HTTP (Backend): Desinfección de entrada contra inyecciones SQL / XSS y sanitización de payloads JSON.
+ ◻️ Documentación & CI/CD (Swagger, .env.example, pruebas unitarias básicas).
+ ◻️ Realizar pruebas unitarias.
+ ◻️ Asegurar que los endpoints en el backend se puedan ejecutar según los permisos que les corresponde.
+ ◻️ Crear example.env o como se llame.
+ ◻️ Crear plantillas para las vistas y crear componentes para que las vistas no sean tan grandes.
+ ◻️ Indicar la creación de los archivos README.md y LICENSE
+ ◻️ Ajustar detalles en subidas de avatar (que el backend y el frontend soliciten el mismo peso, mensajes más claros).
+ ◻️ Modalidad modo oscuro y modo claro.
+ ◻️ Si el usuario ya esta registrado que no le permita registrarse otra vez, sino que lo notifique y lo mande al login.
+ ◻️ Login con redes sociales.
    + ✅ Google (OAuth 2.0 / OpenID Connect).
    + ◻️ GitHub.
    + ◻️ Microsoft (Microsoft Entra ID / Outlook / Azure).
    + ◻️ Apple (Sign in with Apple).
    + ◻️ Meta (Facebook Login) / Instagram.
    + ◻️ X (antes Twitter) / LinkedIn.

### Terminadas
+ ✅ Dockerización.
+ ✅ Refactorización de rutas y controladores en el backend.
+ ✅ Adecuar la aplicación para que sea mas general, por ejemplo cambiar familytree2026-backend por backend, adaptar la vista del home, etc.
+ ✅ CRUD avatars en User Admin.
+ ✅ Refactorizar para acceder a las vistas administrativas con permisos y no con roles.
+ ✅ Homologar vistas admin.
+ ✅ Diagnóstico de la aplicación con IA.
+ ✅ Drag and Drop para gestionar archivos.
+ ✅ Que aparezca la manito cuando el maouse se posicione sobre un botón, o algo por el estilo.
+ ✅ Incluir ruta de documentación (Variable de entorno APP_DOC_VITEPRESS y agregrar enlace en la app.).
+ ✅ Verificar si es necesario variable de entorno IA_ACTIVE.
+ ✅ Personalizar el heder de la página principal (Protocolo Open Graph).
+ ✅ Colocar la opción de mostrar password en login, register y en donde aplique.
+ ✅ Limpiar proyecto frontend de archivos que no se usan.
+ ✅ Implementar mensaje sweetalert en todos los lugares que haga falta.

