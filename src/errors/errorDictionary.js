const ERROR_DICTIONARY = Object.freeze({
  VALIDATION_ERROR: {
    status: 400,
    message: "Los datos enviados no son válidos"
  },
  BAD_REQUEST: {
    status: 400,
    message: "La solicitud no es válida"
  },
  INVALID_MOCK_QTY: {
    status: 400,
    message: "qty debe ser un número entero entre 1 y 100"
  },
  REQUIRED_FIELDS: {
    status: 400,
    message: "Todos los campos son obligatorios"
  },
  INVALID_EMAIL: {
    status: 400,
    message: "Email inválido"
  },
  INVALID_PASSWORD: {
    status: 400,
    message: "La contraseña debe tener al menos 6 caracteres"
  },
  MISSING_CREDENTIALS: {
    status: 400,
    message: "Email y contraseña son obligatorios"
  },
  INVALID_CREDENTIALS: {
    status: 401,
    message: "Credenciales inválidas"
  },
  UNAUTHORIZED: {
    status: 401,
    message: "No autenticado"
  },
  FORBIDDEN: {
    status: 403,
    message: "No tenés permisos para realizar esta acción"
  },
  USER_NOT_FOUND: {
    status: 404,
    message: "Usuario no encontrado"
  },
  PRODUCT_NOT_FOUND: {
    status: 404,
    message: "Producto no encontrado"
  },
  CART_NOT_FOUND: {
    status: 404,
    message: "Carrito no encontrado"
  },
  EVENT_NOT_FOUND: {
    status: 404,
    message: "Evento no encontrado"
  },
  TICKET_NOT_FOUND: {
    status: 404,
    message: "Ticket no encontrado"
  },
  ORDER_NOT_FOUND: {
    status: 404,
    message: "Pedido no encontrado"
  },
  RESOURCE_NOT_FOUND: {
    status: 404,
    message: "Recurso no encontrado"
  },
  USER_ALREADY_EXISTS: {
    status: 409,
    message: "El email ya está registrado"
  },
  RESOURCE_CONFLICT: {
    status: 409,
    message: "La operación entra en conflicto con el estado actual"
  },
  INVALID_EVENT_DATE: {
    status: 400,
    message: "La fecha del evento es inválida"
  },
  EVENT_DATE_PASSED: {
    status: 400,
    message: "La fecha del evento no puede ser pasada"
  },
  INVALID_EVENT_CAPACITY: {
    status: 400,
    message: "La capacidad debe ser mayor a 0"
  },
  INVALID_EVENT_PRICE: {
    status: 400,
    message: "El precio no puede ser negativo"
  },
  EVENT_CANCELLED: {
    status: 400,
    message: "El evento está cancelado"
  },
  EVENT_FINISHED: {
    status: 400,
    message: "El evento ya finalizó"
  },
  EVENT_NOT_PUBLISHED: {
    status: 400,
    message: "El evento no está publicado"
  },
  INVALID_TICKET_QUANTITY: {
    status: 400,
    message: "La cantidad debe ser un entero mayor a 0"
  },
  DUPLICATE_ACTIVE_TICKET: {
    status: 409,
    message: "Ya tenés una inscripción activa para este evento"
  },
  INSUFFICIENT_CAPACITY: {
    status: 409,
    message: "No hay cupos suficientes"
  },
  TICKET_ALREADY_CANCELLED: {
    status: 409,
    message: "El ticket ya está cancelado"
  },
  TICKET_FORBIDDEN: {
    status: 403,
    message: "No tenés permisos para cancelar este ticket"
  },
  MOCK_SEED_FAILED: {
    status: 500,
    message: "No se pudieron insertar los datos de prueba"
  },
  INTERNAL_ERROR: {
    status: 500,
    message: "Error interno del servidor"
  }
});

export default ERROR_DICTIONARY;
