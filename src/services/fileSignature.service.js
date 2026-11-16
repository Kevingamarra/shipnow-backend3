import fs from "node:fs/promises";
import { createHttpError } from "../utils/httpError.js";

const SIGNATURES = {
  "application/pdf": Buffer.from("%PDF-"),
  "image/jpeg": Buffer.from([0xff, 0xd8, 0xff]),
  "image/png": Buffer.from([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a
  ])
};

export const validateFileSignature = async (file) => {
  if (!file?.path) {
    throw createHttpError(
      400,
      "Debés adjuntar un archivo",
      "FILE_REQUIRED"
    );
  }

  const expectedSignature = SIGNATURES[file.mimetype];

  if (!expectedSignature) {
    throw createHttpError(
      400,
      "Tipo de archivo no permitido",
      "INVALID_FILE_TYPE"
    );
  }

  let handle;

  try {
    handle = await fs.open(file.path, "r");

    const buffer = Buffer.alloc(expectedSignature.length);

    const { bytesRead } = await handle.read(
      buffer,
      0,
      buffer.length,
      0
    );

    if (
      bytesRead !== expectedSignature.length ||
      !buffer.equals(expectedSignature)
    ) {
      throw createHttpError(
        400,
        "El contenido del archivo no coincide con su formato",
        "INVALID_FILE_TYPE"
      );
    }
  } catch (error) {
    if (error?.code === "INVALID_FILE_TYPE") {
      throw error;
    }

    throw createHttpError(
      500,
      "No se pudo leer el archivo",
      "FILE_SAVE_ERROR"
    );
  } finally {
    await handle?.close();
  }
};
