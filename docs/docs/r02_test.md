# 🧪 Pruebas unitarias

## ⚙️ Pruebas en el Backend

### Paso 1: Crear la carpeta de pruebas y el archivo `app.test.js`
+ Crea la carpeta `tests` dentro de `backend/src/` o directamente en la raíz de backend, y añade el archivo de prueba básico (`backend/src/tests/app.test.js`) con el código que probaba la ruta 404:
    ```js
    import { describe, it, expect } from 'vitest';
    import request from 'supertest';
    import app from '../src/app.js';

    describe('Pruebas de integración del Servidor y Rutas Base', () => {
        it('Debe responder con un 404 ante una ruta inexistente', async () => {
            const response = await request(app).get('/api/v1/ruta-que-no-existe');
            expect(response.status).toBe(404);
        });
    });
    ```

### Paso 2: ¿Cómo ejecutar las pruebas con Docker?
+ Opción A (Si usas volúmenes de desarrollo en Docker Compose):
    + Si tu `docker-compose.yml` monta tu código local dentro del contenedor en tiempo real, puedes ordenar a Docker que ejecute el comando de pruebas dentro del contenedor de tu backend:
        ```bash
        docker compose exec backend npm run test
        ```
+ Opción B (Ejecución local fuera del contenedor):
    + Si tienes Node.js instalado en tu máquina de desarrollo (fuera de Docker), simplemente puedes entrar a la carpeta backend y correr:
        ```bash
        npm run test
        ```


## 💻 Pruebas en el Frontend


