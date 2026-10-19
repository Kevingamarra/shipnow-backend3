import { ROLES } from "../constants/index.js";
import usersRepository from "../repositories/users.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { createHttpError } from "../utils/httpError.js";

class SessionsService {
  async register({ first_name, last_name, email, password } = {}) {
    if (
      !first_name ||
      !last_name ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      throw createHttpError(400, "Todos los campos son obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw createHttpError(400, "Email inválido");
    }

    if (password.length < 6) {
      throw createHttpError(
        400,
        "La contraseña debe tener al menos 6 caracteres"
      );
    }

    const existingUser = await usersRepository.getByEmail(normalizedEmail);

    if (existingUser) {
      throw createHttpError(409, "El email ya está registrado");
    }

    const user = await usersRepository.create({
      first_name,
      last_name,
      email: normalizedEmail,
      password: createHash(password),
      role: ROLES.USER
    });

    const newUser = user.toObject();
    delete newUser.password;

    return newUser;
  }

  async login(email, password) {
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      throw createHttpError(400, "Email y contraseña son obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await usersRepository.getByEmail(normalizedEmail);

    if (!user || !isValidPassword(user, password)) {
      return null;
    }

    return user;
  }
}

export default new SessionsService();
