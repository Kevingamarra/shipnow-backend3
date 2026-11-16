import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { mock } from "node:test";

import app from "../../src/app.js";
import User from "../../src/models/User.js";
import Order from "../../src/models/Order.js";
import Product from "../../src/models/Product.js";
import { generateToken } from "../../src/utils/jwt.js";
import usersRepository from "../../src/repositories/users.repository.js";
import ordersRepository from "../../src/repositories/orders.repository.js";

import { assertTestDatabase } from "../helpers/testDatabase.js";

const api = request(app);
const createdFiles = [];

const pdfBuffer = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n"
);

describe("Módulo 7 - carga de archivos", function () {
  let admin;
  let user;
  let product;
  let order;
  let adminCookie;

  before(async function () {
    assertTestDatabase();

    const suffix = new mongoose.Types.ObjectId().toString();

    admin = await User.create({
      first_name: "Admin",
      last_name: "Uploads",
      email: `admin-uploads-${suffix}@example.com`,
      password: "testing-only",
      role: "ADMIN"
    });

    user = await User.create({
      first_name: "Usuario",
      last_name: "Uploads",
      email: `user-uploads-${suffix}@example.com`,
      password: "testing-only",
      role: "USER"
    });

    product = await Product.create({
      name: "Producto uploads",
      price: 100,
      category: "testing",
      subcat: "functional"
    });

    order = await Order.create({
      user: user._id,
      products: [
        {
          product: product._id,
          quantity: 1
        }
      ],
      total: 100
    });

    adminCookie = `currentUser=${generateToken(admin)}`;
  });

  after(async function () {
    try {
      assertTestDatabase();

      for (const filename of createdFiles) {
        await fs.rm(filename, { force: true });
      }

      if (order?._id) {
        await Order.deleteOne({ _id: order._id });
      }

      if (product?._id) {
        await Product.deleteOne({ _id: product._id });
      }

      const userIds = [admin?._id, user?._id].filter(Boolean);

      if (userIds.length) {
        await User.deleteMany({
          _id: { $in: userIds }
        });
      }
    } finally {
    }
  });

  it("Carga correctamente un documento de usuario", async function () {
    const response = await api
      .post(`/api/users/${user._id}/documents`)
      .set("Cookie", adminCookie)
      .field("documentType", "DNI")
      .attach("file", pdfBuffer, "dni.pdf");

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");

    const savedUser = await User.findById(user._id);

    expect(savedUser.documents).to.have.lengthOf(1);

    const document = savedUser.documents[0];

    expect(document.originalName).to.equal("dni.pdf");
    expect(document.mimeType).to.equal("application/pdf");
    expect(document.documentType).to.equal("DNI");
    expect(document.size).to.equal(pdfBuffer.length);
    expect(document.filename).to.be.a("string").and.not.empty;
    expect(document.uploadedAt).to.exist;

    createdFiles.push(path.resolve(document.path));

    const stats = await fs.stat(path.resolve(document.path));
    expect(stats.isFile()).to.equal(true);
  });

  it("Carga correctamente un comprobante de pedido", async function () {
    const response = await api
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", pdfBuffer, "comprobante.pdf");

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");

    const savedOrder = await Order.findById(order._id);

    expect(savedOrder.proofs).to.have.lengthOf(1);

    const proof = savedOrder.proofs[0];

    expect(proof.originalName).to.equal("comprobante.pdf");
    expect(proof.documentType).to.equal("ORDER_PROOF");
    expect(proof.mimeType).to.equal("application/pdf");

    createdFiles.push(path.resolve(proof.path));

    const stats = await fs.stat(path.resolve(proof.path));
    expect(stats.isFile()).to.equal(true);
  });

  it("Rechaza una carga sin archivo", async function () {
    const response = await api
      .post(`/api/orders/${order._id}/proof`);

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("FILE_REQUIRED");
  });

  it("Rechaza un tipo de documento inválido", async function () {
    const response = await api
      .post(`/api/users/${user._id}/documents`)
      .set("Cookie", adminCookie)
      .field("documentType", "PASSPORT")
      .attach("file", pdfBuffer, "documento.pdf");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_DOCUMENT_TYPE");
  });

  it("Rechaza archivos con MIME no permitido", async function () {
    const response = await api
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", Buffer.from("contenido de texto"), "archivo.txt");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_FILE_TYPE");
  });

  it("Rechaza archivos cuyo contenido no coincide con el formato", async function () {
    const response = await api
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", Buffer.from("archivo falso"), {
        filename: "falso.pdf",
        contentType: "application/pdf"
      });

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_FILE_TYPE");
  });

  it("Rechaza archivos superiores a 5 MB", async function () {
    const oversizedFile = Buffer.alloc(5 * 1024 * 1024 + 1);

    const response = await api
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", oversizedFile, {
        filename: "grande.pdf",
        contentType: "application/pdf"
      });

    expect(response.status).to.equal(413);
    expect(response.body.code).to.equal("FILE_TOO_LARGE");
  });

  it("Rechaza un campo de archivo incorrecto", async function () {
    const response = await api
      .post(`/api/orders/${order._id}/proof`)
      .attach("archivo", pdfBuffer, "comprobante.pdf");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_FILE_FIELD");
  });

  it("Rechaza documentos de usuarios inexistentes", async function () {
    const missingId = new mongoose.Types.ObjectId();

    const response = await api
      .post(`/api/users/${missingId}/documents`)
      .set("Cookie", adminCookie)
      .field("documentType", "DNI")
      .attach("file", pdfBuffer, "dni.pdf");

    expect(response.status).to.equal(404);
    expect(response.body.code).to.equal("USER_NOT_FOUND");
  });

  it("Rechaza comprobantes de pedidos inexistentes", async function () {
    const missingId = new mongoose.Types.ObjectId();

    const response = await api
      .post(`/api/orders/${missingId}/proof`)
      .attach("file", pdfBuffer, "comprobante.pdf");

    expect(response.status).to.equal(404);
    expect(response.body.code).to.equal("ORDER_NOT_FOUND");
  });


  it("No deja archivos residuales después de una carga rechazada", async function () {
    const uploadDirectory = path.resolve("uploads/orders");

    const beforeFiles = await fs.readdir(uploadDirectory);

    const response = await api
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", Buffer.from("PDF falso"), {
        filename: "rechazado.pdf",
        contentType: "application/pdf"
      });

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_FILE_TYPE");

    const afterFiles = await fs.readdir(uploadDirectory);

    expect(afterFiles.sort()).to.deep.equal(beforeFiles.sort());
  });


  it("Limpia el archivo si MongoDB falla al guardar un documento", async function () {
    const uploadDirectory = path.resolve("uploads/users");
    const beforeFiles = await fs.readdir(uploadDirectory);

    const mocked = mock.method(
      usersRepository,
      "addDocument",
      async () => {
        throw new Error("Fallo simulado de MongoDB");
      }
    );

    try {
      const response = await api
        .post(`/api/users/${user._id}/documents`)
        .set("Cookie", adminCookie)
        .field("documentType", "DNI")
        .attach("file", pdfBuffer, "fallo-documento.pdf");

      expect(response.status).to.equal(500);
      expect(response.body.code).to.equal("INTERNAL_ERROR");

      const afterFiles = await fs.readdir(uploadDirectory);
      expect(afterFiles.sort()).to.deep.equal(beforeFiles.sort());
    } finally {
      mocked.mock.restore();
    }
  });

  it("Limpia el archivo si MongoDB falla al guardar un comprobante", async function () {
    const uploadDirectory = path.resolve("uploads/orders");
    const beforeFiles = await fs.readdir(uploadDirectory);

    const mocked = mock.method(
      ordersRepository,
      "addProof",
      async () => {
        throw new Error("Fallo simulado de MongoDB");
      }
    );

    try {
      const response = await api
        .post(`/api/orders/${order._id}/proof`)
        .attach("file", pdfBuffer, "fallo-comprobante.pdf");

      expect(response.status).to.equal(500);
      expect(response.body.code).to.equal("INTERNAL_ERROR");

      const afterFiles = await fs.readdir(uploadDirectory);
      expect(afterFiles.sort()).to.deep.equal(beforeFiles.sort());
    } finally {
      mocked.mock.restore();
    }
  });

  it("Protege la carga de documentos sin autenticación", async function () {
    const response = await api
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "DNI")
      .attach("file", pdfBuffer, "dni.pdf");

    expect(response.status).to.equal(401);
    expect(response.body.code).to.equal("UNAUTHORIZED");
  });

  it("Rechaza usuarios sin permisos de administrador", async function () {
    const userCookie = `currentUser=${generateToken(user)}`;

    const response = await api
      .post(`/api/users/${user._id}/documents`)
      .set("Cookie", userCookie)
      .field("documentType", "DNI")
      .attach("file", pdfBuffer, "dni.pdf");

    expect(response.status).to.equal(403);
    expect(response.body.code).to.equal("FORBIDDEN");
  });
});
