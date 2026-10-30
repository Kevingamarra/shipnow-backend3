export default {
  "/api/mocks/users": {
    "get": {
      "tags": [
        "Mocks",
        "Users"
      ],
      "summary": "Generar usuarios ficticios",
      "description": "Genera datos ficticios sin guardarlos en MongoDB.",
      "parameters": [
        {
          "name": "qty",
          "in": "query",
          "required": false,
          "description": "Cantidad de registros. Entero entre 1 y 100. Por defecto, 1.",
          "schema": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "default": 1
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Operación realizada correctamente",
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
        "400": {
          "description": "Cantidad inválida: INVALID_MOCK_QTY",
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
  "/api/mocks/drivers": {
    "get": {
      "tags": [
        "Mocks",
        "Users"
      ],
      "summary": "Generar repartidores ficticios",
      "description": "Genera datos ficticios sin guardarlos en MongoDB.",
      "parameters": [
        {
          "name": "qty",
          "in": "query",
          "required": false,
          "description": "Cantidad de registros. Entero entre 1 y 100. Por defecto, 1.",
          "schema": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "default": 1
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Operación realizada correctamente",
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
        "400": {
          "description": "Cantidad inválida: INVALID_MOCK_QTY",
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
  "/api/mocks/orders": {
    "get": {
      "tags": [
        "Mocks",
        "Orders"
      ],
      "summary": "Generar pedidos ficticios",
      "description": "Genera datos ficticios sin guardarlos en MongoDB.",
      "parameters": [
        {
          "name": "qty",
          "in": "query",
          "required": false,
          "description": "Cantidad de registros. Entero entre 1 y 100. Por defecto, 1.",
          "schema": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "default": 1
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Operación realizada correctamente",
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
                      "$ref": "#/components/schemas/Order"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Cantidad inválida: INVALID_MOCK_QTY",
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
  "/api/mocks/deliveries": {
    "get": {
      "tags": [
        "Mocks",
        "Deliveries"
      ],
      "summary": "Generar entregas ficticias",
      "description": "Genera datos ficticios sin guardarlos en MongoDB.",
      "parameters": [
        {
          "name": "qty",
          "in": "query",
          "required": false,
          "description": "Cantidad de registros. Entero entre 1 y 100. Por defecto, 1.",
          "schema": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "default": 1
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Operación realizada correctamente",
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
                      "$ref": "#/components/schemas/Delivery"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Cantidad inválida: INVALID_MOCK_QTY",
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
  "/api/mocks/seed": {
    "post": {
      "tags": [
        "Mocks"
      ],
      "summary": "Insertar datos ficticios en MongoDB",
      "description": "Inserta usuarios, repartidores, pedidos y entregas mediante una transacción. No requiere body.",
      "parameters": [
        {
          "name": "qty",
          "in": "query",
          "required": false,
          "description": "Cantidad de registros. Entero entre 1 y 100. Por defecto, 1.",
          "schema": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "default": 1
          }
        }
      ],
      "responses": {
        "201": {
          "description": "Datos insertados correctamente",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "example": "success"
                  },
                  "usuarios": {
                    "type": "integer",
                    "example": 5
                  },
                  "repartidores": {
                    "type": "integer",
                    "example": 5
                  },
                  "pedidos": {
                    "type": "integer",
                    "example": 5
                  },
                  "entregas": {
                    "type": "integer",
                    "example": 5
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Cantidad inválida: INVALID_MOCK_QTY",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        },
        "500": {
          "description": "Error interno o fallo al insertar datos: MOCK_SEED_FAILED",
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
