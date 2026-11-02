import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

const api = request(app);

const expectError = (response, status, code) => {
  expect(response.status).to.equal(status);
  expect(response.body).to.have.property("status", "error");
  expect(response.body).to.have.property("code", code);
  expect(response.body).to.have.property("message").that.is.a("string").and.is.not.empty;
};

describe("Mocks - generación de datos", () => {
  for (const resource of ["users", "drivers", "orders", "deliveries"]) {
    it("GET /api/mocks/" + resource + " genera dos registros", async () => {
      const response = await api.get("/api/mocks/" + resource).query({ qty: 2 });
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.be.an("array").with.lengthOf(2);
      for (const item of response.body.payload) {
        expect(item).to.be.an("object");
        if (resource === "users" || resource === "drivers") {
          expect(item).to.include.all.keys("first_name", "last_name", "email", "role");
          expect(item).not.to.have.property("password");
        } else if (resource === "orders") {
          expect(item).to.include.all.keys("user", "products", "status", "priority", "total");
        } else {
          expect(item).to.include.all.keys("order", "driver", "status");
        }
      }
    });
    it("GET /api/mocks/" + resource + " rechaza cantidades inválidas", async () => {
      const response = await api.get("/api/mocks/" + resource).query({ qty: 150 });
      expectError(response, 400, "INVALID_MOCK_QTY");
    });
  }
});

describe("Logger", () => {
  it("GET /api/logger/test devuelve los niveles registrados", async () => {
    const response = await api.get("/api/logger/test");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Prueba del logger ejecutada");
    expect(response.body.levels).to.deep.equal(["debug", "http", "info", "warning", "error", "fatal"]);
  });
});

describe("Swagger", () => {
  it("GET /api/docs/ sirve la interfaz de documentación", async () => {
    const response = await api.get("/api/docs/");
    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.match(/text\/html/);
    expect(response.text).to.include("swagger-ui");
  });
});

describe("Manejo de errores", () => {
  it("GET /api/ruta-inexistente devuelve 404 estandarizado", async () => {
    const response = await api.get("/api/ruta-inexistente");
    expectError(response, 404, "RESOURCE_NOT_FOUND");
    expect(response.body.message).to.equal("Ruta no encontrada");
  });
  it("GET /api/users sin autenticación devuelve 401", async () => {
    const response = await api.get("/api/users");
    expectError(response, 401, "UNAUTHORIZED");
  });
});
