import { createHttpError } from "../utils/httpError.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createHttpError(401, "No autenticado"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        createHttpError(
          403,
          "No tenés permisos para realizar esta acción"
        )
      );
    }

    return next();
  };
};

export default authorize;
