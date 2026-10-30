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
- Sistema de mocking para generación de datos de prueba.
- Seed controlado de usuarios, repartidores, pedidos y entregas en MongoDB.
- Relaciones entre usuarios, pedidos y entregas mediante referencias ObjectId.
- Uso de constantes del dominio para roles, estados y prioridades.


# Mocking y carga de datos de prueba

El proyecto incorpora un módulo de mocking para generar datos de prueba de ShipNow API, respetando la arquitectura por capas.

La implementación se organiza mediante:

- Routes
- Controllers
- Services
- Repositories
- Models

Los generadores utilizan las constantes del dominio definidas en `src/constants/index.js`. Los endpoints GET devuelven datos simulados sin persistirlos en MongoDB.

## Endpoints de mocking

Todos los endpoints aceptan el parámetro `qty`, que debe ser un entero entre 1 y 100. Si se omite, se utiliza 1.

### GET /api/mocks/users?qty=5

Genera usuarios simulados con el rol `USER). No devuelve contraseñas ni guarda los usuarios en MongoDB.

### GET /api/mocks/drivers?qty=5

Genera repartidores simulados con el rol `DRIVER`. No devuelve contraseñas ni guarda los registros en MongoDB.

### GET /api/mocks/orders?qty=5

Genera pedidos simulados con usuario referenciado, productos vacíos, estado `PENDING`, prioridad `MEDIUM` y total de prueba.

Los identificadores de usuario son ficticios y no implican que esos usuarios existan en la base de datos.

### GET /api/mocks/deliveries?qty=5

Genera entregas simuladas con referencias ficticias a pedidos y repartidores. No guarda documentos en MongoDB.

### POST /api/mocks/seed?qty=10

Inserta datos de prueba en MongoDB. Para cada cantidad solicitada, el proceso crea:

- Usuarios con rol `USER`.
- Repartidores con rol `DRIVER`.
- Pedidos relacionados con los usuarios insertados.
- Entregas relacionadas con los pedidos y los repartidores insertados.

Las contraseñas se almacenan mediante el hash utilizado por el sistema de autenticación. Para las cuentas de prueba generadas, la contraseña original es `123456`.

La respuesta informa la cantidad de registros creados:

```json
{
  "status": "success",
  "usuarios": 10,
  "repartidores": 10,
  "pedidos": 10,
  "entregas": 10
}
```

**Importante:** cada ejecución de este endpoint inserta nuevos registros. Utilizarlo únicamente en una base de datos de desarrollo o pruebas.

## Cómo probar los endpoints

Consultar datos simulados sin guardarlos:

```bash
curl -i "http://localhost:4000/api/mocks/users?qty=2"
curl -i "http://localhost:4000/api/mocks/drivers?qty=2"
curl -i "http://localhost:4000/api/mocks/orders?qty=2"
curl -i "http://localhost:4000/api/mocks/deliveries?qty=2"
```

Insertar registros de prueba:

```bash
curl -i -X POST "http://localhost:4000/api/mocks/seed?qty=2"
```

Validar el parámetro de cantidad:

```bash
curl -i "http://localhost:4000/api/mocks/users?qty=0"
```

La última petición debe responder con HTTP 400. Para ejecutar las pruebas, iniciar el servidor mediante `npm run dev) y configurar la conexión a MongoDB en las variables de entorno requeridas por el proyecto.

---

# Autor

**Kevin Gamarra**

Proyecto desarrollado como entrega para la materia **Programación Backend III – Testing y Escalabilidad** de Coderhouse.


---


## Justificación de la arquitectura por capas

El proyecto separa las responsabilidades entre Controllers, Services y
Repositories para mantener el código organizado, facilitar su mantenimiento
y permitir probar cada parte de forma independiente.

- **Controller:** recibe las solicitudes HTTP, obtiene los parámetros y datos
  de entrada, invoca al servicio correspondiente y construye la respuesta.
  Los errores se delegan al middleware centralizado cuando corresponde.
- **Service:** contiene la lógica de negocio y las validaciones propias de cada
  operación. Coordina las acciones necesarias sin ejecutar directamente las
  consultas a MongoDB.
- **Repository:** encapsula el acceso a los modelos de Mongoose y las
  operaciones de persistencia, como búsquedas, altas, modificaciones y bajas.
  De esta manera, el servicio no depende directamente de los detalles de
  almacenamiento.

Esta separación permite modificar las consultas a la base de datos sin
trasladar esa responsabilidad a los controladores y mantener las reglas de
negocio fuera de la capa de persistencia.

La persistencia de los módulos migrados se centraliza en `src/repositories/`,
evitando mantener una capa DAO duplicada.

---

# Pre-entrega Módulo 3 — Manejo profesional de errores

## Manejo centralizado de errores

ShipNow incorpora una capa común para gestionar errores mediante:

- `src/errors/CustomError.js`: clase de error personalizado.
- `src/errors/errorDictionary.js`: diccionario de códigos, mensajes y estados HTTP.
- `src/utils/httpError.js`: utilidad para crear errores del dominio.
- `src/middlewares/errorHandler.js`: middleware global que transforma los errores en respuestas HTTP uniformes.

Los services detectan los errores del dominio y los propagan mediante errores personalizados. Los controllers delegan los errores al middleware global utilizando `next(error)`.

El middleware también contempla errores de validación de Mongoose, identificadores con formato incorrecto y conflictos por claves duplicadas.

## Estructura de las respuestas de error

Todas las respuestas gestionadas por el middleware siguen esta estructura:

```json
{
  "status": "error",
  "code": "PRODUCT_NOT_FOUND",
  "message": "Producto no encontrado"
}
```

- `status`: indica que ocurrió un error.
- `code`: identifica el tipo de error.
- `message`: describe el problema.

Los errores de validación suelen responder con HTTP 400, los recursos inexistentes con HTTP 404, los conflictos con HTTP 409 y los errores internos con HTTP 500.

Los errores internos no exponen detalles técnicos de la base de datos al cliente.

## Pruebas del manejo de errores

Iniciar el servidor con las variables de entorno configuradas:

```bash
npm run dev
```

### 1. Cantidad negativa en mocks

```bash
curl -i "http://localhost:4000/api/mocks/users?qty=-1"
```

Resultado esperado: HTTP 400 y código `INVALID_MOCK_QTY`.

### 2. Cantidad igual a cero

```bash
curl -i "http://localhost:4000/api/mocks/drivers?qty=0"
```

Resultado esperado: HTTP 400 y código `INVALID_MOCK_QTY`.

### 3. Cantidad decimal

```bash
curl -i "http://localhost:4000/api/mocks/orders?qty=1.5"
```

Resultado esperado: HTTP 400 y código `INVALID_MOCK_QTY`.

### 4. Cantidad superior al límite

```bash
curl -i "http://localhost:4000/api/mocks/deliveries?qty=101"
```

Resultado esperado: HTTP 400 y código `INVALID_MOCK_QTY`.

El módulo de mocks admite cantidades enteras entre 1 y 100.

### 5. Producto inexistente

```bash
curl -i "http://localhost:4000/api/products/000000000000000000000000"
```

Resultado esperado: HTTP 404 y código `PRODUCT_NOT_FOUND`, siempre que ese identificador no exista en la base de datos.

### 6. Identificador con formato inválido

```bash
curl -i "http://localhost:4000/api/products/id-invalido"
```

Resultado esperado: HTTP 400 y código `BAD_REQUEST`.

### 7. Generación válida de mocks

```bash
curl -i "http://localhost:4000/api/mocks/users?qty=2"
```

Resultado esperado: HTTP 200 y dos usuarios simulados, sin exponer sus contraseñas.

### 8. Seed válido

```bash
curl -i -X POST \
  "http://localhost:4000/api/mocks/seed?qty=2"
```

Resultado esperado: HTTP 201 y confirmación de dos usuarios, dos repartidores, dos pedidos y dos entregas.

### 9. Manejo de fallas durante el seed

El servicio ejecuta las inserciones dentro de una transacción de MongoDB. Si la operación falla, se espera que la transacción revierta sus cambios y que el cliente reciba HTTP 500 con código `MOCK_SEED_FAILED`.

Para verificar este comportamiento, utilizar una base de pruebas compatible con transacciones, provocar un fallo controlado durante la inserción y consultar las colecciones antes y después. No utilizar una base de datos con información importante para esta prueba.

## Logging y monitoreo

ShipNow utiliza Winston para centralizar los registros de la aplicación y
`winston-daily-rotate-file` para la rotación de archivos.

### Niveles disponibles

- `debug`: información detallada para desarrollo.
- `http`: eventos relacionados con solicitudes HTTP.
- `info`: eventos informativos, como el inicio del servidor.
- `warning`: advertencias y solicitudes rechazadas.
- `error`: errores de la aplicación.
- `fatal`: fallas críticas, como problemas de conexión al iniciar.

### Configuración por entorno

El comportamiento se configura mediante `NODE_ENV`.

- `development`: la consola y el archivo general registran desde `debug`.
- `production`: la consola y el archivo general registran desde `info`.
- El archivo de errores registra desde `error`, incluidos los errores críticos `fatal`.

En producción, los niveles `debug` y `http` quedan excluidos de la consola y del archivo general.

### Archivos de logs

Los archivos se generan dentro de `logs/`, en la raíz del proyecto.

- `combined-YYYY-MM-DD.log`: registro general.
- `error-YYYY-MM-DD.log`: errores y fallas críticas, incluidos los niveles
  `error` y `fatal`.

Ambos archivos utilizan `winston-daily-rotate-file`, con rotación diaria,
un tamaño máximo de 20 MB por archivo y una retención de 14 días.

En desarrollo, la consola y el archivo general muestran desde `debug`.
En producción, ambos registran desde `info`, por lo que `debug` y `http`
no se guardan en esos destinos. El archivo de errores conserva los niveles
`error` y `fatal`.

La carpeta `logs/` está excluida de Git mediante `.gitignore`.

### Registro de solicitudes HTTP

El middleware `src/middlewares/httpLogger.js` registra automáticamente
cada solicitud HTTP cuando finaliza su respuesta.

Cada registro incluye:

- Método HTTP.
- Ruta solicitada.
- Código de estado HTTP.
- Duración de procesamiento en milisegundos.

El middleware `injectLogger` agrega el logger a `req.logger`, permitiendo
utilizarlo desde otros middlewares y controladores. El middleware
`httpLogger` registra las solicitudes con el nivel `http`.

### Probar el logger

Iniciar el servidor:

    npm run dev

Consultar el endpoint de prueba:

    curl -i http://localhost:4000/api/logger/test

La respuesta debe ser HTTP 200 y confirmar la ejecución de los seis niveles.
Se pueden revisar los registros en los archivos de la carpeta `logs/`.

Este endpoint es una herramienta de diagnóstico y no una operación de negocio.
