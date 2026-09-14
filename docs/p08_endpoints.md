[🔙](index.md)
---
## 🔌 Endpoints
### 📋 Resumen de Endpoints
| Módulo     | Método   | Endpoint                    | Permiso / Rol requerido   |
| ---------- | -------- | --------------------------- | ------------------------- |
| **System** | `GET`    | `/api/v1/health`            | Público                   |
| **Auth**   | `POST`   | `/api/v1/auth/register`     | Público                   |
| **Auth**   | `POST`   | `/api/v1/auth/login`        | Público                   |
| **Auth**   | `GET`    | `/api/v1/auth/me`           | Autenticado               |
| **Auth**   | `POST`   | `/api/v1/auth/logout`       | Autenticado               |
| **Users**  | `PUT`    | `/api/v1/users/profile`     | Autenticado (Propietario) |
| **Users**  | `POST`   | `/api/v1/users/avatar`      | Autenticado (Propietario) |
| **Users**  | `DELETE` | `/api/v1/users/avatar`      | Autenticado (Propietario) |
| **Users**  | `POST`   | `/api/v1/users/:id/avatar`  | Rol `SUPER_ADMIN`         |
| **Users**  | `DELETE` | `/api/v1/users/:id/avatar`  | Rol `SUPER_ADMIN`         |
| **Users**  | `GET`    | `/api/v1/users`             | `users:read`              |
| **Users**  | `POST`   | `/api/v1/users`             | `users:create`            |
| **Users**  | `PUT`    | `/api/v1/users/:id`         | `users:update`            |
| **Users**  | `PUT`    | `/api/v1/users/:id/roles`   | Rol `SUPER_ADMIN`         |
| **Users**  | `DELETE` | `/api/v1/users/:id`         | `users:delete`            |
| **Roles**  | `GET`    | `/api/v1/roles`             | `roles:read`              |
| **Roles**  | `GET`    | `/api/v1/roles/permissions` | `roles:read`              |
| **Roles**  | `POST`   | `/api/v1/roles`             | `roles:create`            |
| **Roles**  | `PUT`    | `/api/v1/roles/:id`         | `roles:update`            |
| **Roles**  | `DELETE` | `/api/v1/roles/:id`         | `roles:delete`            |
| **Audit**  | `GET`    | `/api/v1/audit-logs`        | Rol `SUPER_ADMIN`         |


### ✅ Pruebas de Endpoints
#### 🩺 Health Check (Público)
1. Ejecutar:
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/health
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 135
        ETag: W/"87-oMMFBNMzQBBLrTxQ0BxtfZkaXSc"
        Date: Fri, 11 Sep 2026 14:28:25 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"API Boilerplate-Node-2026 operativa","environment":"development","timestamp":"2026-09-11T14:28:25.699Z"}
        ```

#### 🔐 Autenticación (Registro y Login)
1. Registro de Usuario (POST `/api/v1/auth/register`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test@example.com",
            "password": "Password123!",
            "firstName": "Pedro",
            "lastName": "Bazó"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 490
        ETag: W/"1ea-Ziyuyh4huSnt7Lm+rOd0shjwLHo"
        Date: Fri, 11 Sep 2026 14:33:04 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Usuario registrado correctamente","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","email":"test@example.com","name":"Pedro Bazó","avatarUrl":null,"createdAt":"2026-09-11T14:33:04.929Z","roles":[]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllYzEyODY1LTk5NjgtNDE0OC05ZjIzLTQyN2MwNjJiNjFhZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGVzIjpbXSwiaWF0IjoxNzg5MTM3MTg0LCJleHAiOjE3ODk3NDE5ODR9.hJZx_Kzt4ctC9DXDoAXHkD7nrSkBTOHGOS32UJD56js"}}bazop@PetrixIesus:~/projects/boilerplate-node-2026$ 
        ```
2. Login (POST `/api/v1/auth/login`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test@example.com",
            "password": "Password123!"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 444
        ETag: W/"1bc-JFL4uAd6y0t1MbhmwuowzSCZ5qY"
        Date: Fri, 11 Sep 2026 14:35:58 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Inicio de sesión exitoso","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","email":"test@example.com","name":"Pedro Bazó","avatarUrl":null,"roles":[]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllYzEyODY1LTk5NjgtNDE0OC05ZjIzLTQyN2MwNjJiNjFhZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGVzIjpbXSwiaWF0IjoxNzg5MTM3MzU4LCJleHAiOjE3ODk3NDIxNTh9.63emy0B8wPbLhjjb2PMuitlQ1YldKfSkD_Mctsg31JQ"}}
        ```
3. Logout (POST `/api/v1/auth/logout`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/logout \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 62
        ETag: W/"3e-JaiL2mK4U1hpoEFpxtcTgglXi2w"
        Date: Sat, 12 Sep 2026 09:56:13 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Sesión cerrada correctamente"}        
        ```

#### 👤 Módulo de Usuario Actual y Perfil
1. Guardar token:
    ```bash
    TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllYzEyODY1LTk5NjgtNDE0OC05ZjIzLTQyN2MwNjJiNjFhZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGVzIjpbXSwiaWF0IjoxNzg5MTM3MzU4LCJleHAiOjE3ODk3NDIxNTh9.63emy0B8wPbLhjjb2PMuitlQ1YldKfSkD_Mctsg31JQ"
    ```
2. Obtener Usuario Autenticado (GET `/api/v1/auth/me`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/auth/me \
        -H "Authorization: Bearer $TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 197
        ETag: W/"c5-bLjFlUieGmW2j4AgO9AAQRgMhB8"
        Date: Fri, 11 Sep 2026 14:46:26 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","email":"test@example.com","name":"Pedro Bazó","avatarUrl":null,"roles":[],"createdAt":"2026-09-11T14:33:04.929Z"}}}
        ```
3. Actualizar Perfil Propio (PUT `/api/v1/users/profile`):
    ```bash
    curl -i -X PUT http://localhost:3000/api/v1/users/profile \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Pedro Bazó Updated"
        }'    
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 239
        ETag: W/"ef-+h5Ev2dALvVipCh4DzgXbZ7Mbp4"
        Date: Fri, 11 Sep 2026 14:48:53 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Perfil actualizado correctamente","data":{"user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com","avatarUrl":null,"createdAt":"2026-09-11T14:33:04.929Z"}}}
        ```
4. Subir Avatar (POST `/api/v1/users/avatar`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/users/avatar \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -F "avatar=@/home/bazop/projects/boilerplate-node-2026/temporal/img/img03.png"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 317
        ETag: W/"13d-QAeaRs0qRyanTdMMTUbhx6UQ+Os"
        Date: Sat, 12 Sep 2026 10:02:11 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar actualizado","data":{"user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com","avatarUrl":"http://minio:9000/app-uploads/avatars/user_bc29c571-acd1-4f15-9412-62cfd78c832e_1789207331804.png","createdAt":"2026-09-10T19:44:08.864Z"}}}
        ```
5. Eliminar Avatar (DELETE `/api/v1/users/avatar`):
    ```bash
    curl -i -X DELETE http://localhost:3000/api/v1/users/avatar \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 220
        ETag: W/"dc-l0CNaHN1DDNQ6G/Ec3V2oKceorg"
        Date: Sat, 12 Sep 2026 10:06:45 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar eliminado","data":{"user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com","avatarUrl":null,"createdAt":"2026-09-10T19:44:08.864Z"}}}
        ```
6. Guardar id de usuario:
    ```bash
    # Este es un id cualquier existente
    TARGET_USER_ID="14f33bf7-e8c4-488d-bef0-dbc2f828402c"
    ```
7. Subir / Reemplazar Avatar por ID (POST `/api/v1/users/:id/avatar`):
    ```bash
    curl -i -X POST "http://localhost:3000/api/v1/users/$TARGET_USER_ID/avatar" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -F "avatar=@/home/bazop/projects/boilerplate-node-2026/temporal/img/img03.png"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 348
        ETag: W/"15c-+1fGSa5zAD6d/yWw/sJuLuoL7wM"
        Date: Sat, 12 Sep 2026 12:44:02 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar de usuario actualizado","data":{"user":{"id":"14f33bf7-e8c4-488d-bef0-dbc2f828402c","name":"Emilio Piña Sisneros","email":"emilio.pinasisneros@hotmail.com","avatarUrl":"http://minio:9000/app-uploads/avatars/user_14f33bf7-e8c4-488d-bef0-dbc2f828402c_1789217042038.png","createdAt":"2026-09-10T19:44:37.296Z"}}}
        ```
8. Eliminar Avatar por ID (DELETE `/api/v1/users/:id/avatar`):
    ```bash
    curl -i -X DELETE "http://localhost:3000/api/v1/users/$TARGET_USER_ID/avatar" \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 251
        ETag: W/"fb-ATd7/p6oRhvdKsfLfdyg0lFnpL4"
        Date: Sat, 12 Sep 2026 12:46:12 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Avatar de usuario eliminado","data":{"user":{"id":"14f33bf7-e8c4-488d-bef0-dbc2f828402c","name":"Emilio Piña Sisneros","email":"emilio.pinasisneros@hotmail.com","avatarUrl":null,"createdAt":"2026-09-10T19:44:37.296Z"}}}
        ```

#### 👥 Módulo de Gestión de Usuarios y Permisos
1. Intento de Lectura de Usuarios Sin Permisos (GET `/api/v1/users`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/users \
        -H "Authorization: Bearer $TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 403 Forbidden
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 100
        ETag: W/"64-vHCjCX/9IVbhi+hGyQqJAftVu0c"
        Date: Fri, 11 Sep 2026 14:52:18 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"fail","message":"No tienes el permiso necesario (users:read) para realizar esta acción"}
        ```
2. Intento de Acceso a Auditoría Sin Rol (GET `/api/v1/audit-logs`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/audit-logs \
        -H "Authorization: Bearer $TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 403 Forbidden
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 90
        ETag: W/"5a-KT9oi/x5iO4UaZkH7LH3zrb/hAk"
        Date: Fri, 11 Sep 2026 14:53:46 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"fail","message":"No tienes los permisos requeridos para ejecutar esta acción"}bazop@PetrixIesus:~/projects/boilerplate-node-2026$ 
        ```

#### 🕵️ Autenticación como Super Admin y Pruebas Administrativas
1. Login con Super Admin (POST `/api/v1/auth/login`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@boilerplate.com",
            "password": "tu_password_super_seguro"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 486
        ETag: W/"1e6-KR/OwvXav4Pyut+i4kI+dq7E0Q0"
        Date: Fri, 11 Sep 2026 15:00:56 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Inicio de sesión exitoso","data":{"user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","email":"admin@boilerplate.com","name":"Super Admin","avatarUrl":null,"roles":["SUPER_ADMIN"]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjMjljNTcxLWFjZDEtNGYxNS05NDEyLTYyY2ZkNzhjODMyZSIsImVtYWlsIjoiYWRtaW5AYm9pbGVycGxhdGUuY29tIiwicm9sZXMiOlsiU1VQRVJfQURNSU4iXSwiaWF0IjoxNzg5MTM4ODU2LCJleHAiOjE3ODk3NDM2NTZ9.4pH0s-JCausWXv5wJw0UEkm7G9JCf1MQfo4ieiTTqcA"}}
        ```
2. Guardar token del SUPER_ADMIN:
    ```bash
    ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjMjljNTcxLWFjZDEtNGYxNS05NDEyLTYyY2ZkNzhjODMyZSIsImVtYWlsIjoiYWRtaW5AYm9pbGVycGxhdGUuY29tIiwicm9sZXMiOlsiU1VQRVJfQURNSU4iXSwiaWF0IjoxNzg5MTM4ODU2LCJleHAiOjE3ODk3NDM2NTZ9.4pH0s-JCausWXv5wJw0UEkm7G9JCf1MQfo4ieiTTqcA"
    ```
3. Intento de Lectura de Usuarios Con Permisos (GET `/api/v1/users`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/users \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 2124
        ETag: W/"84c-4COdtHNi+vR/CwG30Cd7wJwWlUc"
        Date: Fri, 11 Sep 2026 15:05:18 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"users":[{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-11T14:33:04.929Z","roles":[]},{"id":"14f33bf7-e8c4-488d-bef0-dbc2f828402c","name":"Emilio Piña Sisneros","email":"emilio.pinasisneros@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"15a22d36-af2a-4d56-9a84-6bf31b5c455b","name":"María Corrales Ulibarri","email":"maria_corralesulibarri@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"21ecd189-f322-40a5-94be-e05563066538","name":"Rosario Negrón Alejandro","email":"rosario.negronalejandro63@yahoo.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"31caa5d2-6a4e-482f-bf76-bcf8ca44beae","name":"Manuel Reyes Paz","email":"manuel_reyespaz@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"4ad334ff-1069-4ef3-a973-5a6ea89c6ec5","name":"Lilia Godoy Sedillo","email":"lilia.godoysedillo12@gmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"6ba4cc7d-c615-4bc2-ac7a-ef1c0683ed44","name":"Rodrigo Cervantes Bernal","email":"rodrigo_cervantesbernal@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"70698dcc-a52d-424e-8ff1-9efde9814979","name":"Gonzalo Vallejo Domínguez","email":"gonzalo.vallejodominguez42@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"71901a46-1793-4cfb-8b54-9f81a4dd12dd","name":"Antonia Alcalá Santana","email":"antonia.alcalasantana56@gmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]},{"id":"7fd8ca82-10ad-4acb-a4c4-7843cdf5fad7","name":"Sancho Aguayo Delgadillo","email":"sancho_aguayodelgadillo@hotmail.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-10T19:44:37.296Z","roles":[]}],"pagination":{"total":27,"page":1,"totalPages":3}}}
        ```
4. Intento de Acceso a Auditoría Con Rol (GET `/api/v1/audit-logs`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/audit-logs \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 3647
        ETag: W/"e3f-g14LSGLcunhIohSZBX2dPNfrBHo"
        Date: Fri, 11 Sep 2026 15:07:12 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"logs":[{"id":"18792b52-1562-40c3-8f89-9872693e817b","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"LOGIN_SUCCESS","entity":"Auth","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"ip\":\"::ffff:172.19.0.1\",\"userAgent\":\"curl/8.5.0\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T15:00:56.656Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"4a2a5918-33cb-4ff3-98e4-d0585e3d9a97","userId":"9ec12865-9968-4148-9f23-427c062b61ad","action":"UPDATE_USER","entity":"User","entityId":"9ec12865-9968-4148-9f23-427c062b61ad","details":"{\"name\":\"Pedro Bazó Updated\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-11T14:48:53.522Z","user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com"}},{"id":"214e95ff-d682-4edf-8b11-bb96a09cab87","userId":"9ec12865-9968-4148-9f23-427c062b61ad","action":"LOGIN_SUCCESS","entity":"Auth","entityId":"9ec12865-9968-4148-9f23-427c062b61ad","details":"{\"ip\":\"::ffff:172.19.0.1\",\"userAgent\":\"curl/8.5.0\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T14:35:58.517Z","user":{"id":"9ec12865-9968-4148-9f23-427c062b61ad","name":"Pedro Bazó Updated","email":"test@example.com"}},{"id":"dc1eb351-2ace-4de2-9c0e-fdfa3b0425f9","userId":null,"action":"CREATE_USER","entity":"User","entityId":"9ec12865-9968-4148-9f23-427c062b61ad","details":"{\"email\":\"test@example.com\",\"password\":\"[PROTECTED]\",\"name\":\"Pedro Bazó\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-11T14:33:04.943Z","user":null},{"id":"2e293d04-4fc5-4236-accb-8ea33de95c6e","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"LOGIN_SUCCESS","entity":"Auth","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"ip\":\"::ffff:172.19.0.1\",\"userAgent\":\"curl/8.5.0\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T11:17:57.856Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"6054581f-ec57-45f0-be98-fc2c9a29aa86","userId":null,"action":"LOGIN_FAILED","entity":"Auth","entityId":null,"details":"{\"email\":\"admin@boilerplate.com\",\"reason\":\"Contraseña incorrecta\",\"ip\":\"::ffff:172.19.0.1\"}","ipAddress":"::ffff:172.19.0.1","createdAt":"2026-09-11T11:14:35.640Z","user":null},{"id":"b240b81c-76be-44c3-a481-a9c20a6e5c01","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"LOGIN","entity":"Auth","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"message\":\"Inicio de sesión exitoso\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-10T19:45:14.435Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"9ba5cd18-1972-48e6-bf2e-c940cebdf7a2","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"UPDATE","entity":"User","entityId":"bc29c571-acd1-4f15-9412-62cfd78c832e","details":"{\"field\":\"email\",\"old\":\"old@test.com\",\"new\":\"admin@boilerplate.com\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-10T19:45:14.435Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}},{"id":"0e1df34c-fe80-49f0-8daa-6cbe8b451bc9","userId":"bc29c571-acd1-4f15-9412-62cfd78c832e","action":"CREATE","entity":"Person","entityId":"1","details":"{\"name\":\"Juan Pérez\",\"role\":\"Padre\"}","ipAddress":"127.0.0.1","createdAt":"2026-09-10T19:45:14.435Z","user":{"id":"bc29c571-acd1-4f15-9412-62cfd78c832e","name":"Super Admin","email":"admin@boilerplate.com"}}],"pagination":{"total":9,"page":1,"totalPages":1}}}
        ```
5. Crear Usuario Admin (POST `/api/v1/users`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/users \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "nuevo.usuario@example.com",
            "password": "Password123!",
            "name": "Carlos Gómez"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 180
        ETag: W/"b4-vYvuxiteRQ1SAiG2U2YnEPUTJjE"
        Date: Sat, 12 Sep 2026 09:29:40 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"user":{"id":"47372aff-6ada-4220-a01e-cb9ec281de29","email":"nuevo.usuario@example.com","name":"Carlos Gómez","createdAt":"2026-09-12T09:29:40.219Z"}}}
        ```
6. Actualizar Usuario (PUT `/api/v1/users/:id`):
    ```bash
    curl -i -X PUT http://localhost:3000/api/v1/users/47372aff-6ada-4220-a01e-cb9ec281de29 \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Carlos Gómez Editado",
            "isActive": true
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express        
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 284
        ETag: W/"11c-YKLWFCgSequAQ4PoiWp/zEENhMY"
        Date: Sat, 12 Sep 2026 09:37:57 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Usuario actualizado correctamente","data":{"user":{"id":"47372aff-6ada-4220-a01e-cb9ec281de29","name":"Carlos Gómez Editado","email":"nuevo.usuario@example.com","avatarUrl":null,"isActive":true,"createdAt":"2026-09-12T09:29:40.219Z","roles":["USER"]}}}
        ```

#### 🔑 Módulo de Gestión de Roles y Permisos
1. Consultar Roles Existentes (GET `/api/v1/roles`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/roles \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 577
        ETag: W/"241-xSvZ1d0OWFMkMeGknKjDIQPAWHc"
        Date: Fri, 11 Sep 2026 15:12:32 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"roles":[{"id":"2701bb42-a714-4b26-8062-792723b455fc","name":"ADMIN","description":"Administrador de contenido y usuarios","userCount":0,"permissions":[],"createdAt":"2026-09-10T19:44:08.753Z"},{"id":"a4c6a0e4-c473-4102-a4ee-ee2325170bfd","name":"SUPER_ADMIN","description":"Acceso total y gestión del sistema","userCount":1,"permissions":[],"createdAt":"2026-09-10T19:44:08.661Z"},{"id":"eda3eeb3-108f-4465-9490-d3fc773abe35","name":"USER","description":"Usuario estándar","userCount":0,"permissions":[],"createdAt":"2026-09-10T19:44:08.765Z"}]}
        ```
2. Crear un Nuevo Rol (POST `/api/v1/roles`):
    ```bash
    curl -i -X POST http://localhost:3000/api/v1/roles \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "EDITOR",
            "description": "Rol con permisos de edición de contenido"
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 270
        ETag: W/"10e-29mvH3/Bg6KB7ekdBWeyqAaeUaA"
        Date: Fri, 11 Sep 2026 15:13:54 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Rol creado exitosamente","data":{"role":{"id":"6351d2d9-f0bd-4ef0-be4e-f1b91215d2b4","name":"EDITOR","description":"Rol con permisos de edición de contenido","createdAt":"2026-09-11T15:13:54.158Z","updatedAt":"2026-09-11T15:13:54.158Z"}}}bazop@PetrixIesus:~/projects/boilerplate-node-2026$ 
        ```
3. Consultar Permisos Existentes (GET `/api/v1/roles/permissions`):
    ```bash
    curl -i -X GET http://localhost:3000/api/v1/roles/permissions \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 2055
        ETag: W/"807-KFqX1eBBYdnSUIVJCaamTeuVHgI"
        Date: Sat, 12 Sep 2026 13:48:55 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","data":{"permissions":[{"id":"55432b21-be17-48c2-a70c-032b71a0abb3","action":"admin:access","module":"admin","description":"Permite acceder al panel de administración","createdAt":"2026-09-12T13:44:35.831Z"},{"id":"f81bb368-26ca-453c-a535-b4211d72695a","action":"audit:read","module":"audit","description":"Permite ver el historial de auditoría y actividades","createdAt":"2026-09-12T13:44:35.885Z"},{"id":"29964da3-5596-4bf3-a7f8-c53ab3e632c5","action":"roles:create","module":"roles","description":"Permite crear nuevos roles","createdAt":"2026-09-12T13:44:35.865Z"},{"id":"4f6d24a7-d44b-434b-b8c1-de62465cabc7","action":"roles:delete","module":"roles","description":"Permite eliminar roles","createdAt":"2026-09-12T13:44:35.878Z"},{"id":"470a7381-25e7-4c0b-a29e-8d5080446d5a","action":"roles:read","module":"roles","description":"Permite ver lalista de roles y sus permisos","createdAt":"2026-09-12T13:44:35.860Z"},{"id":"94512c45-b397-45a4-ac6c-e463ba4c69f0","action":"roles:update","module":"roles","description":"Permite modificar roles y asignar permisos","createdAt":"2026-09-12T13:44:35.870Z"},{"id":"af557cb8-24ea-42c9-b498-7b2e14fce236","action":"system:logs:read","module":"system","description":"Permite consultar logs técnicos del servidor y la base de datos","createdAt":"2026-09-12T13:44:35.889Z"},{"id":"96321d6f-9a44-4777-bfba-68c1b49a81d9","action":"users:create","module":"users","description":"Permite registrar nuevos usuarios","createdAt":"2026-09-12T13:44:35.845Z"},{"id":"fda4b531-15a3-41b6-ad1c-4d054c72b357","action":"users:delete","module":"users","description":"Permite eliminar usuarios","createdAt":"2026-09-12T13:44:35.854Z"},{"id":"14164c6b-2abb-434d-be97-0fad2a97a678","action":"users:read","module":"users","description":"Permite ver el listado y detalle de usuarios","createdAt":"2026-09-12T13:44:35.839Z"},{"id":"e8ccff77-5a83-4ba4-a029-4a39b4bbfc61","action":"users:update","module":"users","description":"Permite editar datos de usuarios existentes","createdAt":"2026-09-12T13:44:35.850Z"}]}}
        ```

#### 🏷️ Asignación de Roles a un Usuario y Limpieza
1. Asignar el nuevo rol EDITOR al usuario de prueba (PUT `/api/v1/users/:id/roles`):
    ```bash
    curl -i -X PUT http://localhost:3000/api/v1/users/9ec12865-9968-4148-9f23-427c062b61ad/roles \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "roles": ["USER", "EDITOR"]
        }'
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 65
        ETag: W/"41-pe0mynh+sz1rYl3PdbcIF+I9324"
        Date: Fri, 11 Sep 2026 18:38:10 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Roles actualizados correctamente"}
        ```
2. Eliminar el Rol de Prueba (DELETE `/api/v1/roles/:id`):
    ```bash
    curl -i -X DELETE http://localhost:3000/api/v1/roles/6351d2d9-f0bd-4ef0-be4e-f1b91215d2b4 \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 60
        ETag: W/"3c-L6eA4rBc4UKuCPVzwRH4ZHQbBF8"
        Date: Fri, 11 Sep 2026 18:44:55 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Rol eliminado correctamente"}
        ```
3. Eliminar Usuario de Prueba (DELETE `/api/v1/users/:id`):
    ```bash
    curl -i -X DELETE http://localhost:3000/api/v1/users/9ec12865-9968-4148-9f23-427c062b61ad \
        -H "Authorization: Bearer $ADMIN_TOKEN"
    ```
    + Output:
        ```bash
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Vary: Origin
        Access-Control-Allow-Credentials: true
        Content-Type: application/json; charset=utf-8
        Content-Length: 64
        ETag: W/"40-m85pJrkJ/TZLobmd+w1fnn6BWZo"
        Date: Fri, 11 Sep 2026 18:47:47 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5

        {"status":"success","message":"Usuario eliminado correctamente"}
        ```
---
[🔙](index.md)