import productsRepository from "../repositories/products.repository.js";
import { createHttpError } from "../utils/httpError.js";

class ProductsService {
  async getAll(query) {
    let { limit = 10, page = 1, sort, query: category } = query;

    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    if (!Number.isInteger(limit) || limit < 1 ||
        !Number.isInteger(page) || page < 1) {
      throw createHttpError(
        400,
        "Los datos enviados no son válidos",
        "VALIDATION_ERROR"
      );
    }

    const filter = {};

    if (category) {
      filter.category = category;
    }

    const sortOption = {};

    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const { products, totalProducts } =
      await productsRepository.getAll(
        filter,
        sortOption,
        page,
        limit
      );

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?page=${page - 1}` : null,
      nextLink: page < totalPages ? `/api/products?page=${page + 1}` : null
    };
  }

  async getById(id) {
    const product = await productsRepository.getById(id);

    if (!product) {
      throw createHttpError(
        404,
        "Producto no encontrado",
        "PRODUCT_NOT_FOUND"
      );
    }

    return product;
  }

  async create(productData) {
    return await productsRepository.create(productData);
  }

  async delete(id) {
    const product = await productsRepository.delete(id);

    if (!product) {
      throw createHttpError(
        404,
        "Producto no encontrado",
        "PRODUCT_NOT_FOUND"
      );
    }

    return product;
  }
}

export default new ProductsService();
