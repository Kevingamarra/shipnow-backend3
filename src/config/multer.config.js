import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

import { createHttpError } from "../utils/httpError.js";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

const ALLOWED_TYPES = new Map([
  ["application/pdf", ".pdf"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"]
]);

const createStorage = (folder) =>
  multer.diskStorage({
    destination(req, file, cb) {
      const destination = path.join(UPLOADS_ROOT, folder);

      try {
        fs.mkdirSync(destination, { recursive: true });
        cb(null, destination);
      } catch (error) {
        cb(error);
      }
    },

    filename(req, file, cb) {
      const extension = ALLOWED_TYPES.get(file.mimetype);

      const generatedName =
        `${Date.now()}-${crypto.randomUUID()}${extension}`;

      cb(null, generatedName);
    }
  });

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.has(file.mimetype)) {
    return cb(
      createHttpError(
        400,
        "Tipo de archivo no permitido. Solo PDF, JPG y PNG",
        "INVALID_FILE_TYPE"
      )
    );
  }

  cb(null, true);
};

const createUploader = (folder) =>
  multer({
    storage: createStorage(folder),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1
    },
    fileFilter
  }).single("file");

export const uploadUserDocument = createUploader("users");

export const uploadOrderProof = createUploader("orders");
