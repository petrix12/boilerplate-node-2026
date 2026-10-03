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
FACEBOOK_CLIENT_ID=tu_app_id_aqui
FACEBOOK_CLIENT_SECRET=tu_app_secret_aqui
FACEBOOK_REDIRECT_URL=http://localhost:8000/api/auth/facebook/callback
```
