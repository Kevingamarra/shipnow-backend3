import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/User.js";
import { generateToken } from "../../src/utils/jwt.js";
import { connectTestDatabase, disconnectTestDatabase, assertTestDatabase } from "../helpers/testDatabase.js";

const api = request(app);
const testUsers = [];

describe("Usuarios - autenticación y autorización", function () {
  let adminCookie;
  let userCookie;
  let adminId;

  before(async function () {
    await connectTestDatabase();

    const suffix = Date.now() + "-" + Math.random().toString(36).slice(2);

    const admin = await User.create({
      first_name: "Admin",
      last_name: "Testing",
      email: "admin-" + suffix + "@shipnow-test.example",
      password: "testing-password",
      role: "ADMIN"
    });
    testUsers.push(admin._id);
    adminId = admin._id.toString();

    const user = await User.create({
      first_name: "Usuario",
      last_name: "Testing",
      email: "user-" + suffix + "@shipnow-test.example",
      password: "testing-password",
      role: "USER"
    });
    testUsers.push(user._id);

    adminCookie = "currentUser=" + generateToken(admin);
    userCookie = "currentUser=" + generateToken(user);
  });

  after(async function () {
    try {
      assertTestDatabase();
      if (testUsers.length) {
        await User.deleteMany({ _id: { $in: testUsers } });
      }
    } finally {
      await disconnectTestDatabase();
    }
  });

  it("GET /api/users rechaza un usuario sin permisos", async function () {
    const response = await api.get("/api/users").set("Cookie", userCookie);
    expect(response.status).to.equal(403);
    expect(response.body).to.include({ status: "error", code: "FORBIDDEN" });
    expect(response.body.message).to.be.a("string").and.not.empty;
  });

  it("GET /api/users permite el acceso de un administrador", async function () {
    const response = await api.get("/api/users").set("Cookie", adminCookie);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
    const admin = response.body.payload.find(user => user._id === adminId);
    expect(admin).to.exist;
    expect(admin.role).to.equal("ADMIN");
    expect(admin).not.to.have.property("password");
  });

  it("GET /api/users rechaza un token inválido", async function () {
    const response = await api.get("/api/users").set("Cookie", "currentUser=token-invalido");
    expect(response.status).to.equal(401);
    expect(response.body).to.include({ status: "error", code: "UNAUTHORIZED" });
  });
});
