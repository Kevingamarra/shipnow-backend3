import { generateToken } from "../utils/jwt.js";
import currentUserDTO from "../dto/currentUser.dto.js";
import env from "../config/env.config.js";

export const register = (req, res) => {
  res.status(201).json({
    status: "success",
    payload: currentUserDTO(req.user)
  });
};

export const login = (req, res) => {
  const token = generateToken(req.user);

  res.cookie("currentUser", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600000,
    secure: env.NODE_ENV === "production"
  });

  res.json({
    status: "success",
    message: "Login correcto"
  });
};

export const current = (req, res) => {
  res.json({
    status: "success",
    payload: currentUserDTO(req.user)
  });
};

export const logout = (req, res) => {
  res.clearCookie("currentUser");

  res.json({
    status: "success",
    message: "Sesión cerrada"
  });
};
