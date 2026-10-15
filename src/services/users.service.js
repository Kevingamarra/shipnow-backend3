import usersRepository from "../repositories/users.repository.js";

class UsersService {
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
