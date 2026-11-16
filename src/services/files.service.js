import fs from "node:fs/promises";
import path from "node:path";

import { createHttpError } from "../utils/httpError.js";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

export const DOCUMENT_TYPES = Object.freeze([
  "DNI",
  "LICENSE",
  "OTHER"
]);

export const validateDocumentType = (documentType) => {
  if (!DOCUMENT_TYPES.includes(documentType)) {
    throw createHttpError(
      400,
      "Tipo de documento inválido",
      "INVALID_DOCUMENT_TYPE"
    );
  }
};

export const validateRequiredFile = (file) => {
  if (!file) {
    throw createHttpError(
      400,
      "Debés adjuntar un archivo",
      "FILE_REQUIRED"
    );
  }
};

export const createFileMetadata = (file, documentType) => {
  validateRequiredFile(file);

  return {
    originalName: file.originalname,
    filename: file.filename,
    path: path.relative(process.cwd(), file.path),
    mimeType: file.mimetype,
    size: file.size,
    documentType,
    uploadedAt: new Date()
  };
};

export const deleteUploadedFile = async (file) => {
  if (!file?.path) return;

  const resolvedPath = path.resolve(file.path);
  const relativePath = path.relative(UPLOADS_ROOT, resolvedPath);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    throw createHttpError(
      500,
      "Ruta de archivo no permitida",
      "FILE_SAVE_ERROR"
    );
  }

  try {
    await fs.unlink(resolvedPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};
