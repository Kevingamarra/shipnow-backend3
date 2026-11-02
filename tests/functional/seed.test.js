import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import User from "../../src/models/User.js";
import Order from "../../src/models/Order.js";
import Delivery from "../../src/models/Delivery.js";
import { connectTestDatabase, disconnectTestDatabase, assertTestDatabase } from "../helpers/testDatabase.js";

const api = request(app);

describe("Mocks - seed en MongoDB", function () {
  const createdUserIds = [];
  const createdOrderIds = [];
  const createdDeliveryIds = [];

  before(async function () {
    await connectTestDatabase();
  });

  after(async function () {
    try {
      assertTestDatabase();
      if (createdDeliveryIds.length) {
        await Delivery.deleteMany({ _id: { $in: createdDeliveryIds } });
      }
      if (createdOrderIds.length) {
        await Order.deleteMany({ _id: { $in: createdOrderIds } });
      }
      if (createdUserIds.length) {
        await User.deleteMany({ _id: { $in: createdUserIds } });
      }
    } finally {
      await disconnectTestDatabase();
    }
  });

  it("POST /api/mocks/seed rechaza una cantidad inválida", async function () {
    const response = await api.post("/api/mocks/seed").query({ qty: 0 });
    expect(response.status).to.equal(400);
    expect(response.body).to.include({ status: "error", code: "INVALID_MOCK_QTY" });
    expect(response.body.message).to.be.a("string").and.not.empty;
  });

  it("POST /api/mocks/seed crea usuarios, repartidores, pedidos y entregas", async function () {
    assertTestDatabase();

    const existingUserIds = new Set(
      (await User.find({}, { _id: 1 }).lean()).map(item => item._id.toString())
    );

    const response = await api.post("/api/mocks/seed").query({ qty: 1 });

    const newUsers = await User.find({
      _id: { $nin: [...existingUserIds] }
    }).lean();

    for (const user of newUsers) {
      createdUserIds.push(user._id);
    }

    const userIds = newUsers.map(user => user._id);

    const newOrders = await Order.find({
      user: { $in: userIds }
    }).lean();

    for (const order of newOrders) {
      createdOrderIds.push(order._id);
    }

    const orderIds = newOrders.map(order => order._id);

    const newDeliveries = await Delivery.find({
      order: { $in: orderIds }
    }).lean();

    for (const delivery of newDeliveries) {
      createdDeliveryIds.push(delivery._id);
    }

    expect(response.status).to.equal(201);
    expect(response.body).to.include({
      status: "success",
      usuarios: 1,
      repartidores: 1,
      pedidos: 1,
      entregas: 1
    });

    expect(newUsers).to.have.lengthOf(2);
    expect(newOrders).to.have.lengthOf(1);
    expect(newDeliveries).to.have.lengthOf(1);
  });
});
