import mongoose from "mongoose";
import env from "./env.config.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("Conexión a MongoDB establecida");
  } catch (error) {
    logger.fatal("Error al conectar con MongoDB", {
      message: error.message
    });
    throw error;
  }
};

export default connectDB;
