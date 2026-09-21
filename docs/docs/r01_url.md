# 🔗 URL de interes
---
## 🛠️ Develops
+ Frontend: [https://boilerplate-localhost.com](https://boilerplate-localhost.com).
+ Backend: [http://localhost:3000/api/v1](http://localhost:3000/api/v1).
+ API Health Check: [https://boilerplate-localhost.com/api/health](https://boilerplate-localhost.com/api/health).
+ MinIO Console: [http://localhost:9001](http://localhost:9001).
+ Prisma Studio: [http://localhost:5555](http://localhost:5555).
+ Docs: [http://docs.boilerplate-localhost.com](http://docs.boilerplate-localhost.com).


## 🚀 Producción
+ Frontend: [https://boilerplate-node-2026.vercel.app](https://boilerplate-node-2026.vercel.app).
+ Backend: [https://boilerplate-node-2026.onrender.com/api/v1](https://boilerplate-node-2026.onrender.com/api/v1).
+ API Health Check: [https://boilerplate-node-2026.onrender.com/api/health]().
+ Docs: [https://boilerplate-node-2026-docs-docs.vercel.app](https://boilerplate-node-2026-docs-docs.vercel.app).

## 📁 Infraestructura y repositorios
+ Repositorio de GitHub: [https://github.com/petrix12/boilerplate-node-2026](https://github.com/petrix12/boilerplate-node-2026).
+ Supabase: [https://supabase.com](https://supabase.com).
+ Render: [https://render.com](https://render.com).
+ Vercel: [https://vercel.com](https://vercel.com).



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


