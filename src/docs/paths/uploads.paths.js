const errorResponse = description => ({
  description,
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse"
      }
    }
  }
});

const successResponse = (description, schema) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success"
          },
          message: {
            type: "string",
            example: description
          },
          payload: {
            $ref: `#/components/schemas/${schema}`
          }
        }
      }
    }
  }
});

const idParameter = description => ({
  name: "id",
  in: "path",
  required: true,
  description,
  schema: {
    type: "string"
  }
});

const fileProperty = {
  type: "string",
  format: "binary",
  description: "Archivo PDF, JPG o PNG. Tamaño máximo: 5 MB."
};

export default {
  "/api/users/{id}/documents": {
    post: {
      tags: ["Users"],
      summary: "Cargar documento de usuario",
      description:
        "Permite a un administrador cargar un documento de usuario. Guarda el archivo y sus metadatos en MongoDB.",
      security: [{ cookieAuth: [] }],
      parameters: [
        idParameter("ID del usuario en MongoDB")
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file", "documentType"],
              properties: {
                file: fileProperty,
                documentType: {
                  type: "string",
                  enum: ["DNI", "LICENSE", "OTHER"],
                  example: "DNI"
                }
              }
            }
          }
        }
      },
      responses: {
        201: successResponse(
          "Documento cargado correctamente",
          "User"
        ),
        400: errorResponse("Archivo o datos inválidos"),
        401: errorResponse("No autenticado"),
        403: errorResponse("Permisos insuficientes"),
        404: errorResponse("Usuario no encontrado"),
        413: errorResponse("Archivo superior a 5 MB"),
        500: errorResponse("Error interno del servidor")
      }
    }
  },

  "/api/orders/{id}/proof": {
    post: {
      tags: ["Orders"],
      summary: "Cargar comprobante de pedido",
      description:
        "Carga un comprobante PDF, JPG o PNG asociado a un pedido y registra sus metadatos en MongoDB.",
      parameters: [
        idParameter("ID del pedido en MongoDB")
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: fileProperty
              }
            }
          }
        }
      },
      responses: {
        201: successResponse(
          "Comprobante cargado correctamente",
          "Order"
        ),
        400: errorResponse("Archivo o ID inválido"),
        404: errorResponse("Pedido no encontrado"),
        413: errorResponse("Archivo superior a 5 MB"),
        500: errorResponse("Error interno del servidor")
      }
    }
  }
};
