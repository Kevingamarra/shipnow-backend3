import ERROR_DICTIONARY from "./errorDictionary.js";

class CustomError extends Error {
  constructor({
    code = "INTERNAL_ERROR",
    message,
    status
  } = {}) {
    const definition =
      ERROR_DICTIONARY[code] ?? ERROR_DICTIONARY.INTERNAL_ERROR;

    super(message ?? definition.message);

    this.name = "CustomError";
    this.code = ERROR_DICTIONARY[code] ? code : "INTERNAL_ERROR";
    this.status = status ?? definition.status;

    Error.captureStackTrace?.(this, CustomError);
  }
}

export default CustomError;
