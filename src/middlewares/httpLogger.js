import logger from "../utils/logger.js";

const injectLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

const httpLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e6;

    req.logger.http("Solicitud HTTP procesada", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(duration.toFixed(2))
    });
  });

  next();
};

export { injectLogger, httpLogger };
