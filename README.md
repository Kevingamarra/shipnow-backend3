# ShipNow - Backend III

## Pre-entrega Módulo 1 — Estructura profesional de ShipNow

API REST desarrollada con Node.js, Express y MongoDB, refactorizada mediante una arquitectura profesional por capas.
---

# Descripción

API REST desarrollada con **Node.js**, **Express** y **MongoDB Atlas**, organizada mediante una arquitectura por capas.

El proyecto implementa autenticación con **Passport.js**, **JWT** y **cookies HttpOnly**, además de un sistema de autorización basado en roles (`USER` y `ADMIN`).

La autorización se realiza mediante middlewares reutilizables que diferencian correctamente usuarios no autenticados (**401 Unauthorized**) de usuarios autenticados sin permisos (**403 Forbidden**).

La aplicación quedó preparada para incorporar nuevas estrategias de autenticación (Google, GitHub u otros providers) sin modificar la configuración principal.

---

# Repositorio

GitHub:

https://github.com/Kevingamarra/shipnow-backend3

---

# Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport.js
- Passport Local
- Passport JWT
- Sistema de autorización por roles
- Bcrypt
- JSON Web Token (JWT)
- Cookie Parser
- Dotenv
- CORS

---

# Instalación

## Clonar el repositorio

```bash
git clone https://github.com/Kevingamarra/shipnow-backend3.git
```

## Ingresar al proyecto

```bash
cd shipnow-backend3
```

## Instalar dependencias

```bash
npm install
```

## Configurar variables de entorno

Crear un archivo `.env` tomando como referencia el archivo `.env.example`.

## Ejecutar el proyecto

```bash
npm start
```

## Modo desarrollo

```bash
npm run dev
```

---

# Variables de entorno

El proyecto utiliza las siguientes variables:

- **PORT**: puerto donde se ejecuta el servidor.
- **NODE_ENV**: entorno de ejecución.
- **MONGODB_URI**: cadena de conexión a MongoDB Atlas.
- **JWT_SECRET**: clave utilizada para firmar los tokens JWT.
- **JWT_EXPIRES_IN**: tiempo de expiración del token.
- **MAIL_HOST**: servidor SMTP.
- **MAIL_PORT**: puerto SMTP.
- **MAIL_USER**: usuario del correo.
- **MAIL_PASS**: contraseña de aplicación.
- **MAIL_FROM**: remitente de los emails.

Ejemplo del archivo `.env.example`:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1h

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

---

# Estructura del proyecto

```text
shipnow-backend3/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   ├── env.config.js
│   │   └── passport.config.js
│   ├── constants/
│   │   └── index.js
│   ├── controllers/
│   ├── dao/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── .env.example
├── package.json
└── README.md
```

---

# Arquitectura

El proyecto está organizado siguiendo una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento del código.

- **Routes:** definen los endpoints de la API.
- **Controllers:** reciben las peticiones HTTP y generan las respuestas.
- **Repositories:** única capa encargada del acceso a la persistencia y comunicación con MongoDB/Mongoose.
- **DAO:** encapsula operaciones de acceso a datos utilizadas por los repositories.
- **Models:** definen los esquemas de MongoDB.
- **Config:** contiene la configuración de la base de datos y Passport.
- **Middlewares:** centralizan validaciones y autenticación.
- **Utils:** funciones auxiliares utilizadas por el proyecto.

---

# Autenticación

La autenticación está completamente centralizada mediante **Passport.js**.

Se implementaron tres estrategias:

### Register

La estrategia **register** verifica que el correo electrónico no exista previamente, encripta la contraseña utilizando **bcrypt** y crea el usuario con el rol `USER`.

### Login

La estrategia **login** valida las credenciales del usuario mediante Passport.

Una vez autenticado correctamente, el controlador genera un **JWT** y lo almacena dentro de una cookie **HttpOnly** llamada `currentUser`.

### Current

La estrategia **current** utiliza **Passport JWT** para validar automáticamente el token almacenado en la cookie.

Si el token es válido, el usuario autenticado queda disponible en `req.user`.

Esta arquitectura permite incorporar fácilmente nuevas estrategias de autenticación (Google, GitHub u otros providers) sin modificar la configuración principal de la aplicación.

---

# Endpoints

## Health

### GET /api/health

Verifica que el servidor se encuentre funcionando correctamente.

---
## Products

Endpoints disponibles:

- GET /api/products
- GET /api/products/:pid
- POST /api/products
- DELETE /api/products/:pid

Implementados mediante:

Controller → Service → Repository

---

## Carts

- GET /api/carts
- GET /api/carts/:cid
- POST /api/carts
- POST /api/carts/:cid/products/:pid
- PUT /api/carts/:cid
- PUT /api/carts/:cid/products/:pid
- DELETE /api/carts/:cid/products/:pid
- DELETE /api/carts/:cid

---

## Sessions

- POST /api/sessions/register
- POST /api/sessions/login
- GET /api/sessions/current
- POST /api/sessions/logout

---

## Users

- GET /api/users

---

# Ejemplos de uso

## Registro de usuario

### POST /api/sessions/register

Body:

```json
{
  "first_name": "Kevin",
  "last_name": "Gamarra",
  "email": "kevin@mail.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "status": "success",
  "payload": {
    "_id": "...",
    "first_name": "Kevin",
    "last_name": "Gamarra",
    "email": "kevin@mail.com",
    "role": "USER"
  }
}
```

---

## Inicio de sesión

### POST /api/sessions/login

Body:

```json
{
  "email": "kevin@mail.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Además, el servidor genera un JWT y lo almacena en una cookie **HttpOnly** llamada `currentUser`.

---

## Usuario autenticado

### GET /api/sessions/current

```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "first_name": "Kevin",
    "last_name": "Gamarra",
    "email": "kevin@mail.com",
    "role": "USER"
  }
}
```
---

## Cierre de sesión

### POST /api/sessions/logout

Respuesta:

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

---

# Roles

El sistema utiliza roles centralizados mediante constantes del dominio.

Roles disponibles:

- **ADMIN**: permisos administrativos.
- **USER**: usuario estándar del sistema.

Los valores de dominio se encuentran definidos en:

`src/constants/index.js`

utilizando objetos inmutables con Object.freeze().

# Matriz de permisos

| Acción | USER | ADMIN |
|--------|:----:|:-----:|
| Consultar productos | Sí | Sí |
| Crear productos | No | Sí |
| Eliminar productos | No | Sí |
| Consultar usuarios | No | Sí |

# Rutas protegidas

- **GET /api/sessions/current** → Requiere autenticación mediante JWT.
- **GET /api/users** → Requiere permisos de administrador.
- **POST /api/products** → Requiere permisos administrativos.
- **DELETE /api/products/:pid** → Requiere permisos administrativos.

# Autenticación y autorización

La API diferencia correctamente los errores de autenticación y autorización.

**401 Unauthorized**

Se devuelve cuando el usuario no posee una sesión válida o el JWT es inexistente o inválido.

**403 Forbidden**

Se devuelve cuando el usuario está autenticado correctamente, pero no posee permisos para ejecutar la acción solicitada.

---

# Funcionalidades implementadas

- Arquitectura profesional Controller → Service → Repository.
- Separación de responsabilidades por capas.
- Configuración centralizada mediante env.config.js.
- Validación de variables de entorno obligatorias al iniciar la aplicación.
- Uso de constantes del dominio mediante Object.freeze().
- Refactorización de Products con Repository.
- Refactorización de Users con Repository.
- Acceso a MongoDB encapsulado dentro de la capa Repository.
- Controllers sin acceso directo a modelos Mongoose.
- Services destinados a contener la lógica de negocio.
- Paginación, filtros y ordenamiento de productos.
- Protección de datos sensibles mediante selección de campos.
- Autenticación mediante JWT y Passport.js.
- Variables de entorno documentadas mediante .env.example.

# Autor

**Kevin Gamarra**

Proyecto desarrollado como entrega para la materia **Programación Backend III – Testing y Escalabilidad** de Coderhouse.


---

