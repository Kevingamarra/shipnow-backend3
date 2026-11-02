export default {
  "/api/orders": {
    "get": {
      "tags": [
        "Orders"
      ],
      "summary": "Listar pedidos",
      "description": "Devuelve los pedidos registrados en MongoDB.",
      "responses": {
        "200": {
          "description": "Listado de pedidos",
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
    },
    "post": {
      "tags": [
        "Orders"
      ],
      "summary": "Crear pedido",
      "description": "Crea un pedido con usuario, productos, cantidades y total.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "user",
                "products",
                "total"
              ],
              "properties": {
                "user": {
                  "type": "string",
                  "example": "507f1f77bcf86cd799439011"
                },
                "products": {
                  "type": "array",
                  "minItems": 1,
                  "items": {
                    "type": "object",
                    "required": [
                      "product",
                      "quantity"
                    ],
                    "properties": {
                      "product": {
                        "type": "string",
                        "example": "507f1f77bcf86cd799439011"
                      },
                      "quantity": {
                        "type": "integer",
                        "minimum": 1,
                        "example": 2
                      }
                    }
                  }
                },
                "total": {
                  "type": "number",
                  "minimum": 0,
                  "example": 1500
                },
                "priority": {
                  "type": "string",
                  "enum": [
                    "LOW",
                    "MEDIUM",
                    "HIGH"
                  ],
                  "example": "HIGH"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Pedido creado correctamente",
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
                    "$ref": "#/components/schemas/Order"
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Datos incompletos o inválidos",
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
  "/api/orders/{id}": {
    "get": {
      "tags": [
        "Orders"
      ],
      "summary": "Consultar pedido por ID",
      "description": "Busca un pedido por su identificador de MongoDB.",
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID del pedido en MongoDB",
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Pedido encontrado",
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
                    "$ref": "#/components/schemas/Order"
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "ID inválido",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        },
        "404": {
          "description": "Pedido no encontrado",
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
  "/api/orders/{id}/status": {
    "patch": {
      "tags": [
        "Orders"
      ],
      "summary": "Actualizar estado del pedido",
      "description": "Modifica el estado de un pedido existente.",
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID del pedido en MongoDB",
          "schema": {
            "type": "string"
          }
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "status"
              ],
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "PENDING",
                    "CONFIRMED",
                    "PREPARING",
                    "DELIVERED",
                    "CANCELLED"
                  ],
                  "example": "CONFIRMED"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Estado actualizado",
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
                    "$ref": "#/components/schemas/Order"
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "ID o estado inválido",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        },
        "404": {
          "description": "Pedido no encontrado",
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
  }
};
