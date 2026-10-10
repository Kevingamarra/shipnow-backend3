import mongoose from "mongoose";
import env from "./env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("🔥 MongoDB conectado");
  } catch (error) {
    console.error("❌ Error MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
