import { Router } from "express";
import passport from "passport";

import {
  register,
  login,
  current,
  logout
} from "../controllers/sessionsController.js";

import { createHttpError } from "../utils/httpError.js";

const router = Router();

router.post("/register", (req, res, next) => {
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

  passport.authenticate("register", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(
        createHttpError(400, "No se pudo registrar el usuario")
      );
    }

    req.user = user;
    return next();
  })(req, res, next);
}, register);

router.post("/login", (req, res, next) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return next(
      createHttpError(
        400,
        "Email y contraseña son obligatorios",
        "MISSING_CREDENTIALS"
      )
    );
  }

  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(
        createHttpError(
          401,
          "Credenciales inválidas"
        )
      );
    }

    req.user = user;
    return next();
  })(req, res, next);
}, login);

router.get("/current", (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(createHttpError(401, "No autenticado"));
    }

    req.user = user;
    return next();
  })(req, res, next);
}, current);

router.post("/logout", logout);

export default router;
