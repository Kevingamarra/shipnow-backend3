import logger from "../utils/logger.js";
import usersService from "../services/users.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();

    res.json({
      status: "success",
      payload: users
    });
  } catch (error) {
    next(error);
  }
};


export const uploadUserDocument = async (req, res, next) => {
  try {
    const user = await usersService.addDocument(
      req.params.id,
      req.file,
      req.body?.documentType
    );

    (req.logger ?? logger).info("Documento de usuario cargado", {
      userId: req.params.id,
      filename: req.file.filename,
      documentType: req.body.documentType
    });

    res.status(201).json({
      status: "success",
      message: "Documento cargado correctamente",
      payload: user
    });
  } catch (error) {
    next(error);
  }
};
