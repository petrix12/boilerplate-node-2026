# 📱 Credenciales en Redes Sociales

## 🇬 Google
### Paso 1: Ir a Google Cloud Console
1. Entra a [console.cloud.google.com](console.cloud.google.com).
2. Si te lo pide, inicia sesión con tu cuenta de Google.

### Paso 2: Crear un Proyecto nuevo
Para organizar esto de forma limpia, crearemos un proyecto exclusivo para tu aplicación:
1. En la parte superior de la página, verás una barra superior. Haz clic en el selector de proyectos (suele estar al lado del logo de Google Cloud y muestra el nombre de algún proyecto anterior o "Seleccionar un proyecto").
2. Se abrirá una ventana flotante. Haz clic en "Proyecto nuevo" (o "New Project") arriba a la derecha.
3. Escribe un nombre para tu proyecto (por ejemplo, el nombre de tu app o sistema).
4. Haz clic en "Crear".
5. Una vez creado, asegúrate de seleccionarlo en la barra superior para que quede activo (puede tardar unos segundos en aparecer listo).

### Paso 3: Configurar la "Pantalla de consentimiento de OAuth"
Google necesita saber qué nombre mostrará a los usuarios cuando inicien sesión:
1. En el menú de la izquierda, busca y haz clic en "APIs y servicios" y luego en "Pantalla de consentimiento de OAuth". (Si el menú está oculto, haz clic en las tres rayitas horizontales arriba a la izquierda para desplegarlo).
2. Selecciona el tipo de usuario Externo (External) y haz clic en "Crear".
3. Rellena los campos obligatorios básicos:
    + Nombre de la aplicación: El nombre de tu sistema.
    + Correo electrónico de asistencia del usuario: Tu correo electrónico.
    + Datos de contacto del desarrollador: Tu correo electrónico (al final del formulario).
4. Haz clic en "Guardar y continuar".
5. En las siguientes pantallas ("Permisos" y "Usuarios de prueba"), por ahora no necesitamos agregar nada complejo. Solo haz clic en "Guardar y continuar" hasta llegar al final y dale a "Volver al panel".

### Paso 5: Copiar tus valores
¡Listo! Te aparecerá una ventana emergente con tus datos:
1. Verás el ID de cliente (termina en .apps.googleusercontent.com).
2. Verás la Clave secreta del cliente (Client Secret).
Copia ambos códigos y llévalos a tu archivo .env en el backend de esta manera:
```ini
SOCIAL_GOOGLE_CLIENT_ID=aqui-pegas-tu-client-id.apps.googleusercontent.com
SOCIAL_GOOGLE_CLIENT_SECRET=aqui-pegas-tu-client-secret
```

## 🇫 Facebook
### Paso 1: Crear y configurar la App en Meta for Developers
1. Entra en developers.facebook.com e inicia sesión con tu cuenta personal o de desarrollador.
2. Ve a Mis Apps y haz clic en Crear una app.
3. Selecciona el tipo de app (por lo general, "Consumidor" o "Negocio" según prefieras, para pruebas de login con redes sociales "Consumidor" suele ser la más directa).
4. Rellena el nombre de la app, tu correo y asocia (o crea) tu cuenta de Meta Business si te lo pide.

### Paso 2: Configurar "Facebook Login"
1. Una vez dentro del panel de tu app, busca el producto Facebook Login (Iniciar sesión con Facebook) y dale a Configurar.
2. Selecciona la plataforma web (Web).
3. Introduce la URL de tu sitio web de desarrollo (por ejemplo, http://localhost:5173 o el puerto que uses en tu frontend de Vue).
4. En la configuración de Facebook Login, ve a Configuración (Settings) dentro de ese producto y añade los URIs de redirección válidos de OAuth (por ejemplo, la URL de tu backend que procesa el callback de autenticación, como http://localhost:8000/api/auth/facebook/callback o similar según cómo tengas estructurado tu backend en Laravel).

### Paso 3: Obtener las Credenciales
En la sección Configuración de la app > Básica obtendrás:
+ App ID (Identificador de la app)
+ App Secret (Secreto de la app - tendrás que hacer clic en "Mostrar")

### Paso 4: Configurar el Backend (Laravel / tu API)
Estas credenciales tendrás que llevarlas a las variables de entorno de tu backend (por ejemplo, en el archivo .env de Laravel si estás usando Socialite):
```ini
SOCIAL_META_CLIENT_ID=tu-facebook-app-id
SOCIAL_META_CLIENT_SECRET=tu-facebook-app-secret
```

### Variables de Facebook importantes configurar
+ `Configuración de la app > Básica`:
    + Nombre visible: `Boilerplate`.
    + Dominios de la app:
        + `boilerplate-localhost.com`.
        + `127.0.0.1`.
        + `boilerplate-node-2026.vercel.app`.
    + Correo electrónico de contacto: `bazo.pedro@gmail.com`.
    + URL de la política de privacidad: `https://boilerplate-node-2026.vercel.app/privacy`.
    + URL de Condiciones del servicio: `https://boilerplate-node-2026.vercel.app/terms`.
    + Eliminación de datos de usuario:
        + URL de instrucciones para la eliminación de datos
            + `https://boilerplate-node-2026.vercel.app/data-deletion`.
    + Ícono de la app: adjuntar el ícono de la aplicación.
    + `Sitio web > URL del sitio`: `https://boilerplate-node-2026.vercel.app`.
+ `Casos de uso > Personalizar`:
    + Permisos y funciones (Agregar):
        + email
        + public_profile
    + `Copnfigurar > Configuración del cliente de OAuth`:
        + Inicio de sesión del cliente de OAuth: `Si`.
        + Inicio de sesión de OAuth web: `No`.
        + Forzar reautenticación de OAuth web: `No`.
        + Usar modo estricto para URI de redireccionamiento: `Si`.
        + Aplicar HTTPS: `Si`.
        + Inicio de sesión de OAuth de navegador integrado: `No`.
        + URI de redireccionamiento de OAuth válidos:
            + `https://boilerplate-localhost.com/login`.
            + `https://boilerplate-localhost.com/`.
            + `https://boilerplate-node-2026.vercel.app/login`.
            + `https://boilerplate-node-2026.vercel.app/`.
        + Dominios permitidos para el SDK para JavaScript:
            + `https://boilerplate-localhost.com/`.
            + `https://boilerplate-node-2026.vercel.app/`.

## 🇱 Linkedin
### Paso 1: Crear la aplicación en LinkedIn Developer
1. Entra al [LinkedIn Developer Portal](https://developer.linkedin.com/) e inicia sesión con tu cuenta personal o de empresa de LinkedIn.
2. En la barra de navegación superior, haz clic en Create app (Crear aplicación).
3. Completa el formulario de registro:
    + App name: El nombre de tu aplicación (por ejemplo, `NodeVue Boilerplate`).
    + LinkedIn Page: Debes vincular una página de empresa de LinkedIn de la cual seas administrador (es un requisito obligatorio de LinkedIn para crear aplicaciones que usen la API). Si no tienes una, tendrás que crear una página de empresa sencilla previamente.
        + Si no tienes ninguna: Crear una página de empresa en LinkedIn toma menos de 2 minutos. Ve a tu perfil personal de LinkedIn, busca en el menú de la barra lateral o superior la sección de organizaciones/empresas ("Páginas" -> "Crear una página de empresa"), ponle un nombre genérico que encaje con tu marca o con el boilerplate (por ejemplo, el nombre de tu estudio o un nombre comercial temporal), sube cualquier logo y ¡listo! Con eso ya podrás seleccionarla en el portal de desarrolladores.
    + Privacy policy URL: La URL de la política de privacidad de tu web (la que creamos antes).
    + App logo: Sube un logotipo representativo.
4. Acepta los términos de la plataforma y haz clic en Create app.

### Paso 2: Configurar los Productos (Permisos de Login)
Una vez creada la app, estarás en el panel de control de tu aplicación:
1. Ve a la pestaña Products (Productos).
2. Busca el producto llamado Sign In with LinkedIn using OpenID Connect (Iniciar sesión con LinkedIn usando OpenID Connect) y haz clic en Request (Solicitar). Se aprobará de inmediato.

### Paso 3: Obtener el Client ID y Client Secret
1. En la misma interfaz de tu aplicación, dirígete a la pestaña Auth (Autenticación).
2. Aquí encontrarás directamente los dos valores que necesitas:
    + Client ID: Es el identificador público de tu aplicación. Cópialo y asígnalo a tu variable `SOCIAL_LINKEDIN_CLIENT_ID`.
    + Client Secret: Haz clic en el botón para mostrarlo o generarlo. Cópialo y asígnalo a tu variable `SOCIAL_LINKEDIN_CLIENT_SECRET`. (Guárdalo bien, ya que por seguridad solo se muestra completo una vez).

### Paso 4: Configurar las URLs de redirección (OAuth 2.0 redirects)
Aprovechando que estás en la pestaña Auth, baja hasta la sección de Authorized redirect URLs (URLs de redirección autorizadas) y añade las URLs de retorno de tu frontend o backend según corresponda (por ejemplo, http://localhost:5173/auth/linkedin/callback o la ruta de tu entorno de producción).
+ Authorized redirect URLs for your app:
    + `https://boilerplate-node-2026.vercel.app/auth/linkedin/callback`.
    + `https://boilerplate-localhost.com/auth/linkedin/callback`.

