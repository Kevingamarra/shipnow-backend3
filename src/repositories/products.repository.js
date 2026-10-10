import Product from "../models/Product.js";

class ProductsRepository {

  async getAll(filter = {}, sortOption = {}, page = 1, limit = 10) {

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v");

    return {
      products,
      totalProducts
    };
  }

  async getById(id) {
    return await Product.findById(id)
      .select("-__v");
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductsRepository();
