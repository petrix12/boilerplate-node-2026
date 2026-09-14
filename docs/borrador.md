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


