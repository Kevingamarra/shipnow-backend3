import { applySchemaEnums } from "../docs/schemas/schema-enums.js";
import sessionPaths from "../docs/paths/sessions.paths.js";
import systemPaths from "../docs/paths/system.paths.js";
import mockPaths from "../docs/paths/mocks.paths.js";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description:
        "API REST de ShipNow desarrollada con Node.js, Express y MongoDB. Incluye gestión de usuarios, modelos de pedidos y entregas, generación de datos de prueba y monitoreo mediante Winston."
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Servidor local de desarrollo"
      }
    ],
    tags: [
      {
        name: "Users",
        description: "Gestión y consulta de usuarios"
      },
      {
        name: "Orders",
        description: "Pedidos y generación de pedidos de prueba"
      },
      {
        name: "Deliveries",
        description: "Entregas y generación de entregas de prueba"
      },
      {
        name: "Mocks",
        description: "Generación e inserción de datos de prueba"
      },
      {
        name: "Logger",
        description: "Herramientas de validación del sistema de logging"
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "currentUser",
          description: "Cookie HttpOnly con JWT obtenida mediante el login."
        }
      }
    }
  },
  apis: [
    "./src/docs/schemas/*.js",
    "./src/docs/paths/*.js"
  ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
swaggerSpec.paths = { ...swaggerSpec.paths, ...mockPaths, ...systemPaths, ...sessionPaths };

export default swaggerSpec;

applySchemaEnums(swaggerSpec);
