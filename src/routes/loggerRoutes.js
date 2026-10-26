import { Router } from "express";
import logger from "../utils/logger.js";

const router = Router();

router.get("/test", (req, res) => {
  logger.debug("Prueba del logger: debug");
  logger.http("Prueba del logger: http");
  logger.info("Prueba del logger: info");
  logger.warning("Prueba del logger: warning");
  logger.error("Prueba del logger: error");
  logger.fatal("Prueba del logger: fatal");

  res.json({
    status: "success",
    message: "Prueba del logger ejecutada",
    levels: ["debug", "http", "info", "warning", "error", "fatal"]
  });
});

export default router;
