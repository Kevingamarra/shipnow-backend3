import User from "../models/User.js";

class UsersRepository {

  async getAll() {
    return await User.find()
      .select("-password -__v");
  }

  async getById(id) {
    return await User.findById(id)
      .select("-password -__v");
  }

  async getByEmail(email) {
    return await User.findOne({ email })
      .select("-password -__v");
  }

  async create(userData) {
    return await User.create(userData);
  }
}

export default new UsersRepository();
