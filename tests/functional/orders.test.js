import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import Order from "../../src/models/Order.js";
import User from "../../src/models/User.js";
import Product from "../../src/models/Product.js";
import { connectTestDatabase, disconnectTestDatabase, assertTestDatabase } from "../helpers/testDatabase.js";

const api = request(app);
let userId;
let productId;
const createdIds = [];
const testUserIds = [];
const testProductIds = [];

describe("Pedidos - pruebas funcionales", function () {
  let orderId;

  before(async function () {
    await connectTestDatabase();
    assertTestDatabase();

    const uniqueEmail = "orders-test-" + new mongoose.Types.ObjectId().toString() + "@example.com";

    const user = await User.create({
      first_name: "Usuario",
      last_name: "Testing",
      email: uniqueEmail,
      password: "testing-only-not-for-login",
      role: "USER"
    });

    userId = user._id;
    testUserIds.push(userId);

    const product = await Product.create({
      name: "Producto de testing",
      price: 750,
      category: "testing",
      subcat: "functional"
    });

    productId = product._id;
    testProductIds.push(productId);
  });

  after(async function () {
    try {
      assertTestDatabase();
      if (createdIds.length) {
        await Order.deleteMany({ _id: { $in: createdIds } });
      }
      if (testProductIds.length) {
        await Product.deleteMany({ _id: { $in: testProductIds } });
      }
      if (testUserIds.length) {
        await User.deleteMany({ _id: { $in: testUserIds } });
      }
    } finally {
      await disconnectTestDatabase();
    }
  });

  it("POST /api/orders crea un pedido", async function () {
    const response = await api.post("/api/orders").send({
      user: userId.toString(),
      products: [{ product: productId.toString(), quantity: 2 }],
      total: 1500,
      priority: "HIGH"
    });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.include.keys("_id", "user", "products", "status", "priority", "total");
    expect(response.body.payload.status).to.equal("PENDING");
    expect(response.body.payload.priority).to.equal("HIGH");
    expect(response.body.payload.total).to.equal(1500);

    orderId = response.body.payload._id;
    createdIds.push(orderId);
  });

  it("GET /api/orders devuelve un listado", async function () {
    const response = await api.get("/api/orders");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
    expect(response.body.payload.some(order => order._id === orderId)).to.equal(true);
  });

  it("GET /api/orders/:id devuelve el pedido creado", async function () {
    const response = await api.get("/api/orders/" + orderId);
    expect(response.status).to.equal(200);
    expect(response.body.payload._id).to.equal(orderId);
    expect(response.body.payload.total).to.equal(1500);
  });

  it("POST /api/orders rechaza datos incompletos", async function () {
    const response = await api.post("/api/orders").send({ total: 100 });
    expect(response.status).to.equal(400);
    expect(response.body).to.include({ status: "error", code: "REQUIRED_FIELDS" });
    expect(response.body.message).to.be.a("string").and.not.empty;
  });

  it("POST /api/orders rechaza cantidades inválidas", async function () {
    const response = await api.post("/api/orders").send({
      user: userId.toString(),
      products: [{ product: productId.toString(), quantity: 0 }],
      total: 100
    });
    expect(response.status).to.equal(400);
    expect(response.body).to.include({ status: "error", code: "BAD_REQUEST" });
  });

  it("GET /api/orders/:id devuelve 404 si no existe", async function () {
    const missingId = new mongoose.Types.ObjectId().toString();
    const response = await api.get("/api/orders/" + missingId);
    expect(response.status).to.equal(404);
    expect(response.body).to.include({ status: "error", code: "ORDER_NOT_FOUND" });
    expect(response.body.message).to.equal("Pedido no encontrado");
  });

  it("GET /api/orders/:id rechaza un ID inválido", async function () {
    const response = await api.get("/api/orders/id-invalido");
    expect(response.status).to.equal(400);
    expect(response.body).to.include({ status: "error", code: "BAD_REQUEST" });
  });

  it("PATCH /api/orders/:id/status actualiza el estado", async function () {
    const response = await api.patch("/api/orders/" + orderId + "/status").send({ status: "CONFIRMED" });
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload.status).to.equal("CONFIRMED");
  });

  it("PATCH /api/orders/:id/status devuelve 404 si no existe", async function () {
    const missingId = new mongoose.Types.ObjectId().toString();

    const response = await api
      .patch("/api/orders/" + missingId + "/status")
      .send({ status: "CONFIRMED" });

    expect(response.status).to.equal(404);
    expect(response.body).to.include({
      status: "error",
      code: "ORDER_NOT_FOUND",
      message: "Pedido no encontrado"
    });
  });

  it("PATCH /api/orders/:id/status rechaza un ID inválido", async function () {
    const response = await api
      .patch("/api/orders/id-invalido/status")
      .send({ status: "CONFIRMED" });

    expect(response.status).to.equal(400);
    expect(response.body).to.include({
      status: "error",
      code: "BAD_REQUEST",
      message: "El ID del pedido no es válido"
    });
  });

  it("PATCH /api/orders/:id/status rechaza estados inválidos", async function () {
    const response = await api.patch("/api/orders/" + orderId + "/status").send({ status: "DESCONOCIDO" });
    expect(response.status).to.equal(400);
    expect(response.body).to.include({ status: "error", code: "BAD_REQUEST" });
  });
});
