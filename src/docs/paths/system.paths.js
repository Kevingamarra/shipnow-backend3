export default {
  "/api/users": {
    "get": {
      "tags": [
        "Users"
      ],
      "summary": "Consultar usuarios registrados",
      "description": "Devuelve los usuarios registrados. Requiere autenticación mediante cookie JWT y rol de administrador.",
      "security": [
        {
          "cookieAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "Usuarios obtenidos correctamente",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "example": "success"
                  },
                  "payload": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          }
        },
        "401": {
          "description": "No autenticado",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        },
        "403": {
          "description": "No tenés permisos para realizar esta acción",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        },
        "500": {
          "description": "Error interno del servidor",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        }
      }
    }
  },
  "/api/logger/test": {
    "get": {
      "tags": [
        "Logger"
      ],
      "summary": "Probar los niveles del logger",
      "description": "Endpoint de diagnóstico que genera mensajes en los niveles debug, http, info, warning, error y fatal. No realiza operaciones de negocio.",
      "responses": {
        "200": {
          "description": "Prueba del logger ejecutada",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "example": "success"
                  },
                  "message": {
                    "type": "string",
                    "example": "Prueba del logger ejecutada"
                  },
                  "levels": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "example": [
                      "debug",
                      "http",
                      "info",
                      "warning",
                      "error",
                      "fatal"
                    ]
                  }
                }
              }
            }
          }
        },
        "500": {
          "description": "Error interno del servidor",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        }
      }
    }
  }
};
