import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "PORT",
  "MONGODB_URI",
  "NODE_ENV",
  "JWT_SECRET",
  "JWT_EXPIRES_IN"
];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    throw new Error(
      `❌ Falta variable de entorno requerida: ${variable}`
    );
  }
}

export default {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM
};
