import logger from "../utils/logger.js";
import { validateFileSignature } from "./fileSignature.service.js";
import mongoose from "mongoose";
import { createHttpError } from "../utils/httpError.js";
import {
  validateDocumentType,
  validateRequiredFile,
  createFileMetadata,
  deleteUploadedFile
} from "./files.service.js";
import usersRepository from "../repositories/users.repository.js";

class UsersService {

  async addDocument(id, file, documentType) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw createHttpError(400, "ID de usuario inválido", "BAD_REQUEST");
      }

      validateDocumentType(documentType);
      validateRequiredFile(file);

      const user = await usersRepository.getById(id);

      if (!user) {
        throw createHttpError(404, "Usuario no encontrado", "USER_NOT_FOUND");
      }

      await validateFileSignature(file);

      const metadata = createFileMetadata(file, documentType);

      const updatedUser = await usersRepository.addDocument(id, metadata);

      if (!updatedUser) {
        throw createHttpError(404, "Usuario no encontrado", "USER_NOT_FOUND");
      }

      return updatedUser;
    } catch (error) {
      try {
        await deleteUploadedFile(file);
      } catch (cleanupError) {
        logger.error("No se pudo limpiar el archivo cargado", {
          error: cleanupError.message,
          path: file?.path
        });
      }

      throw error;
    }
  }

  async getAll() {
    const users = await usersRepository.getAll();

    if (!Array.isArray(users)) {
      const error = new Error("No se pudo obtener el listado de usuarios");
      error.status = 500;
      throw error;
    }

    return users;
  }
}

export default new UsersService();
