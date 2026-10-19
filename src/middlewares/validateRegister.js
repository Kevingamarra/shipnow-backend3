import { createHttpError } from "../utils/httpError.js";

const validateRegister = (req, res, next) => {
  const { first_name, last_name, email, password } = req.body ?? {};

  if (
    !first_name ||
    !last_name ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return next(
      createHttpError(
        400,
        "Todos los campos son obligatorios",
        "REQUIRED_FIELDS"
      )
    );
  }

  return next();
};

export default validateRegister;
