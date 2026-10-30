import CustomError from "../errors/CustomError.js";
import ERROR_DICTIONARY from "../errors/errorDictionary.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let code = "INTERNAL_ERROR";
  let status = 500;

  if (err instanceof CustomError) {
    code = err.code;
    status = err.status;
  } else if (err?.name === "ValidationError") {
    code = "VALIDATION_ERROR";
    status = 400;
  } else if (err?.name === "CastError") {
    code = "BAD_REQUEST";
    status = 400;
  } else if (err?.code === 11000) {
    code = "RESOURCE_CONFLICT";
    status = 409;
  }

  const definition =
    ERROR_DICTIONARY[code] ?? ERROR_DICTIONARY.INTERNAL_ERROR;

  const message =
    err instanceof CustomError ? err.message : definition.message;

  const context = {
    code,
    status,
    method: req.method,
    path: req.originalUrl
  };

  if (status >= 500) {
    (req.logger ?? logger).error("Error inesperado al procesar una solicitud", {
      ...context,
      error: err.message,
      stack: err.stack
    });
  } else {
    (req.logger ?? logger).warning("Solicitud rechazada", context);
  }

  return res.status(status).json({
    status: "error",
    code,
    message
  });
};

export default errorHandler;
