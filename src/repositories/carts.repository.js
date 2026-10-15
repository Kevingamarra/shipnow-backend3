import Cart from "../models/Cart.js";

class CartsRepository {
  async getAll() {
    return await Cart.find().populate("products.product");
  }

  async getById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async getByIdWithoutPopulate(id) {
    return await Cart.findById(id);
  }

  async create() {
    return await Cart.create({ products: [] });
  }

  async update(id, data) {
    return await Cart.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async save(cart) {
    return await cart.save();
  }
}

export default new CartsRepository();
