import CustomError from "../errors/CustomError.js";
import ERROR_DICTIONARY from "../errors/errorDictionary.js";

export const createHttpError = (status, message, code) => {
  const dictionaryEntry = code
    ? ERROR_DICTIONARY[code]
    : Object.entries(ERROR_DICTIONARY).find(
        ([, definition]) =>
          definition.status === status &&
          definition.message === message
      )?.[1];

  if (code && !dictionaryEntry) {
    throw new Error(`Código de error no registrado: ${code}`);
  }

  const resolvedCode = code ??
    Object.entries(ERROR_DICTIONARY).find(
      ([, definition]) =>
        definition.status === status &&
        definition.message === message
    )?.[0] ??
    (status === 400 ? "BAD_REQUEST" :
      status === 401 ? "UNAUTHORIZED" :
      status === 403 ? "FORBIDDEN" :
      status === 404 ? "RESOURCE_NOT_FOUND" :
      status === 409 ? "RESOURCE_CONFLICT" :
      "INTERNAL_ERROR");

  return new CustomError({
    status: dictionaryEntry?.status ?? status,
    message: message ?? dictionaryEntry?.message,
    code: resolvedCode
  });
};
