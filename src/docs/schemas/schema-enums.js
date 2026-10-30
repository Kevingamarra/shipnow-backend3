export const applySchemaEnums = (spec) => {
  const schemas = spec.components.schemas;
  spec.components.responses ??= {};
  spec.components.responses.NotFoundResponse = { description: "Ruta inexistente: HTTP 404, código RESOURCE_NOT_FOUND y mensaje Ruta no encontrada.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" }, example: { status: "error", code: "RESOURCE_NOT_FOUND", message: "Ruta no encontrada" } } } };
  schemas.SuccessResponse.properties.message = { type: "string", description: "Mensaje opcional de confirmación, utilizado por operaciones como login y logout.", example: "Login correcto" };
  schemas.Order.description = "Pedido de ShipNow. Los endpoints GET de mocks generan objetos sin _id ni timestamps; MongoDB agrega esos campos al persistirlos.";
  schemas.Delivery.description = "Entrega de ShipNow. Los endpoints GET de mocks generan objetos sin _id, timestamps ni deliveredAt; MongoDB aplica los valores definidos en el modelo al persistirlos.";
  schemas.User.properties.role.enum = ["ADMIN", "ORGANIZER", "USER", "DRIVER"];
  schemas.User.properties.role.example = "USER";
  schemas.Order.properties.status.enum = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"];
  schemas.Order.properties.status.example = "PENDING";
  schemas.Order.properties.status.description = "Estado permitido del pedido. Mongoose rechaza valores fuera del enum durante la validación. Actualmente no existe un endpoint HTTP para modificarlo.";
  schemas.Delivery.properties.status.description = "Estado permitido de la entrega. Mongoose rechaza valores fuera del enum durante la validación. Actualmente no existe un endpoint HTTP para modificarlo.";
  schemas.Order.properties.priority.enum = ["LOW", "MEDIUM", "HIGH"];
  schemas.Order.properties.priority.example = "MEDIUM";
  schemas.Delivery.properties.status.enum = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"];
  schemas.Delivery.properties.status.example = "PENDING";
};
