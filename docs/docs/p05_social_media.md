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
GOOGLE_CLIENT_ID=aqui-pegas-tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=aqui-pegas-tu-client-secret
```

## GitHub
## Microsoft (Microsoft Entra ID / Outlook / Azure).
## Apple (Sign in with Apple).
## Meta (Facebook Login) / Instagram.
## X (antes Twitter) / LinkedIn.