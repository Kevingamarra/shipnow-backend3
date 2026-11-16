import test from "node:test";
import assert from "node:assert/strict";
import swaggerSpec from "../src/config/swagger.config.js";

const operations = Object.entries(swaggerSpec.paths).flatMap(([path, methods]) => Object.entries(methods).map(([method, operation]) => ({ path, method, operation })));

test("La especificación OpenAPI es válida en su estructura básica", () => {
  assert.equal(swaggerSpec.openapi, "3.0.3");
  assert.ok(swaggerSpec.info?.title);
  assert.ok(swaggerSpec.info?.version);
  assert.ok(swaggerSpec.info?.description);
  assert.ok(swaggerSpec.servers?.length > 0);
});

test("Los cinco módulos están documentados", () => {
  for (const tag of ["Users", "Orders", "Deliveries", "Mocks", "Logger"]) {
    assert.ok(swaggerSpec.tags.some(item => item.name === tag), `Falta el tag ${tag}`);
  }
});

test("Existen los seis schemas reutilizables", () => {
  for (const name of ["User", "Order", "Delivery", "OrderItem", "ErrorResponse", "SuccessResponse"]) {
    assert.ok(swaggerSpec.components?.schemas?.[name], `Falta el schema ${name}`);
  }
});

test("Todas las operaciones tienen documentación y respuestas HTTP", () => {
  assert.ok(operations.length > 0, "No se encontraron operaciones");
  for (const { path, method, operation } of operations) {
    assert.ok(operation.summary || operation.description, `Falta descripción en ${method.toUpperCase()} ${path}`);
    assert.ok(Object.keys(operation.responses || {}).length > 0, `Faltan respuestas en ${method.toUpperCase()} ${path}`);
    assert.ok(Object.keys(operation.responses).some(code => /^2\d\d$/.test(code)), `Falta respuesta exitosa en ${method.toUpperCase()} ${path}`);
  }
});

test("Todas las referencias internas de OpenAPI existen", () => {
  const references = new Set();
  const walk = value => {
    if (!value || typeof value !== "object") return;
    if (typeof value.$ref === "string") references.add(value.$ref);
    for (const nested of Object.values(value)) walk(nested);
  };
  walk(swaggerSpec);
  for (const reference of references) {
    if (!reference.startsWith("#/")) continue;
    const target = reference.slice(2).split("/").reduce((value, key) => value?.[key.replace(/~1/g, "/").replace(/~0/g, "~")], swaggerSpec);
    assert.ok(target, `Referencia inexistente: ${reference}`);
  }
});

test("Los endpoints de carga de archivos están documentados", () => {
  const endpoints = [
    "/api/users/{id}/documents",
    "/api/orders/{id}/proof"
  ];

  for (const endpoint of endpoints) {
    const operation = swaggerSpec.paths[endpoint]?.post;

    assert.ok(operation, `Falta POST ${endpoint}`);
    assert.ok(operation.summary, `Falta el resumen de ${endpoint}`);
    assert.ok(operation.responses["201"], `Falta HTTP 201 en ${endpoint}`);
    assert.ok(operation.responses["400"], `Falta HTTP 400 en ${endpoint}`);
    assert.ok(operation.responses["413"], `Falta HTTP 413 en ${endpoint}`);
  }
});

test("Las cargas utilizan multipart/form-data con archivo obligatorio", () => {
  const endpoints = [
    "/api/users/{id}/documents",
    "/api/orders/{id}/proof"
  ];

  for (const endpoint of endpoints) {
    const operation = swaggerSpec.paths[endpoint].post;
    const schema = operation.requestBody.content["multipart/form-data"].schema;

    assert.ok(schema, `Falta multipart/form-data en ${endpoint}`);
    assert.ok(schema.required.includes("file"));
    assert.equal(schema.properties.file.type, "string");
    assert.equal(schema.properties.file.format, "binary");
  }
});

test("La documentación de usuarios exige autenticación y documentType", () => {
  const operation =
    swaggerSpec.paths["/api/users/{id}/documents"].post;

  const schema =
    operation.requestBody.content["multipart/form-data"].schema;

  assert.deepEqual(operation.security, [{ cookieAuth: [] }]);

  assert.ok(schema.required.includes("documentType"));

  assert.deepEqual(
    schema.properties.documentType.enum,
    ["DNI", "LICENSE", "OTHER"]
  );

  assert.ok(operation.responses["401"]);
  assert.ok(operation.responses["403"]);
});
