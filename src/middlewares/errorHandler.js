import CustomError from "../errors/CustomError.js";
import ERROR_DICTIONARY from "../errors/errorDictionary.js";

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

  // Los errores inesperados no deben filtrar detalles internos.
  const message =
    err instanceof CustomError
      ? err.message
      : definition.message;

  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json({
    status: "error",
    code,
    message
  });
};

export default errorHandler;
