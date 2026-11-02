import mongoose from "mongoose";
import env from "../../src/config/env.config.js";

const TEST_DB = "shipnow_test";

export const assertTestDatabase = () => {
  if (env.NODE_ENV !== "test" || process.env.NODE_ENV !== "test") {
    throw new Error("SEGURIDAD: NODE_ENV debe ser test");
  }
  const uri = new URL(env.MONGODB_URI);
  if (uri.pathname !== "/" + TEST_DB) {
    throw new Error("SEGURIDAD: MONGODB_URI debe apuntar a shipnow_test");
  }
  if (mongoose.connection.readyState === 1 && mongoose.connection.db.databaseName !== TEST_DB) {
    throw new Error("SEGURIDAD: la conexión activa no apunta a shipnow_test");
  }
};

export const connectTestDatabase = async () => {
  assertTestDatabase();
  if (mongoose.connection.readyState !== 0) {
    throw new Error("SEGURIDAD: ya existe una conexión MongoDB activa");
  }
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  assertTestDatabase();
};

export const disconnectTestDatabase = async () => {
  await mongoose.disconnect();
};
