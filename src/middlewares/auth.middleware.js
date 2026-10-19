import { verifyToken } from "../utils/jwt.js";
import { createHttpError } from "../utils/httpError.js";

const auth = (req, res, next) => {
  try {
    const token = req.cookies?.currentUser;

    if (!token) {
      return next(createHttpError(401, "No autenticado"));
    }

    req.user = verifyToken(token);
    return next();
  } catch {
    return next(createHttpError(401, "No autenticado"));
  }
};

export default auth;
