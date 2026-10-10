import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
