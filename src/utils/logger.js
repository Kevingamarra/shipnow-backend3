import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import env from "../config/env.config.js";

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const details = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : "";

    return `${timestamp} [${level}] ${stack || message}${details}`;
  })
);

const logsDirectory = path.resolve(process.cwd(), "logs");
const isProduction = env.NODE_ENV === "production";

const logger = winston.createLogger({
  levels,
  level: isProduction ? "info" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: isProduction ? "info" : "debug",
      format: logFormat
    }),
    new DailyRotateFile({
      dirname: logsDirectory,
      filename: "combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      level: isProduction ? "info" : "debug"
    }),
    new DailyRotateFile({
      dirname: logsDirectory,
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      level: "error"
    })
  ],
  exitOnError: false
});

export default logger;
