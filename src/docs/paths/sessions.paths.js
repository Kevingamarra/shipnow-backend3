const paths = {
  "/api/sessions/register": {
    "post": {
      "tags": [
        "Users"
      ],
      "summary": "Registrar un usuario",
      "description": "Crea una cuenta con rol USER. Requiere nombre, apellido, email válido y contraseña de al menos 6 caracteres.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "first_name",
                "last_name",
                "email",
                "password"
              ],
              "properties": {
                "first_name": {
                  "type": "string",
                  "example": "Ana"
                },
                "last_name": {
                  "type": "string",
                  "example": "López"
                },
                "email": {
                  "type": "string",
                  "format": "email",
                  "example": "ana@example.com"
                },
                "password": {
                  "type": "string",
                  "format": "password",
                  "minLength": 6,
                  "example": "clave123"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Usuario registrado correctamente",
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
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Campos obligatorios, email inválido o contraseña demasiado corta",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        },
        "409": {
          "description": "El email ya está registrado",
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
  "/api/sessions/login": {
    "post": {
      "tags": [
        "Users"
      ],
      "summary": "Iniciar sesión",
      "description": "Valida las credenciales y establece la cookie HttpOnly currentUser con JWT durante una hora.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "email",
                "password"
              ],
              "properties": {
                "email": {
                  "type": "string",
                  "format": "email",
                  "example": "ana@example.com"
                },
                "password": {
                  "type": "string",
                  "format": "password",
                  "example": "clave123"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Inicio de sesión correcto",
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
                    "example": "Login correcto"
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Email y contraseña son obligatorios",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              }
            }
          }
        },
        "401": {
          "description": "Credenciales inválidas",
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
  "/api/sessions/current": {
    "get": {
      "tags": [
        "Users"
      ],
      "summary": "Consultar usuario autenticado",
      "description": "Devuelve los datos del usuario identificado mediante la cookie JWT currentUser.",
      "security": [
        {
          "cookieAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "Usuario autenticado",
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
                    "$ref": "#/components/schemas/User"
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
  "/api/sessions/logout": {
    "post": {
      "tags": [
        "Users"
      ],
      "summary": "Cerrar sesión",
      "description": "Elimina la cookie currentUser. No requiere autenticación previa.",
      "responses": {
        "200": {
          "description": "Sesión cerrada",
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
                    "example": "Sesión cerrada"
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

export default paths;
