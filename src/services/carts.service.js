import cartsRepository from "../repositories/carts.repository.js";
import { createHttpError } from "../utils/httpError.js";

class CartsService {
  async getAll() {
    return await cartsRepository.getAll();
  }

  async getById(id) {
    const cart = await cartsRepository.getById(id);

    if (!cart) {
      throw createHttpError(
        404,
        "Carrito no encontrado",
        "CART_NOT_FOUND"
      );
    }

    return cart;
  }

  async create() {
    return await cartsRepository.create();
  }

  async addProduct(cid, pid) {
    const cart = await cartsRepository.getByIdWithoutPopulate(cid);

    if (!cart) {
      throw createHttpError(
        404,
        "Carrito no encontrado",
        "CART_NOT_FOUND"
      );
    }

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    return await cartsRepository.save(cart);
  }

  async deleteProduct(cid, pid) {
    const cart = await cartsRepository.getByIdWithoutPopulate(cid);

    if (!cart) {
      throw createHttpError(
        404,
        "Carrito no encontrado",
        "CART_NOT_FOUND"
      );
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== pid
    );

    return await cartsRepository.save(cart);
  }

  async clear(cid) {
    const cart = await cartsRepository.update(cid, {
      products: []
    });

    if (!cart) {
      throw createHttpError(
        404,
        "Carrito no encontrado",
        "CART_NOT_FOUND"
      );
    }

    return cart;
  }

  async update(cid, products) {
    if (!Array.isArray(products)) {
      throw createHttpError(
        400,
        "Los productos deben enviarse en un arreglo",
        "VALIDATION_ERROR"
      );
    }

    const cart = await cartsRepository.update(cid, {
      products
    });

    if (!cart) {
      throw createHttpError(
        404,
        "Carrito no encontrado",
        "CART_NOT_FOUND"
      );
    }

    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw createHttpError(
        400,
        "La cantidad debe ser un entero mayor a 0",
        "VALIDATION_ERROR"
      );
    }

    const cart = await cartsRepository.getByIdWithoutPopulate(cid);

    if (!cart) {
      throw createHttpError(
        404,
        "Carrito no encontrado",
        "CART_NOT_FOUND"
      );
    }

    const product = cart.products.find(
      p => p.product.toString() === pid
    );

    if (!product) {
      throw createHttpError(
        404,
        "Producto no encontrado en el carrito",
        "PRODUCT_NOT_FOUND"
      );
    }

    product.quantity = quantity;

    return await cartsRepository.save(cart);
  }
}

export default new CartsService();
