import mongoose from "mongoose";
import ordersRepository from "../repositories/orders.repository.js";
import { ORDER_STATUS, ORDER_PRIORITY } from "../constants/index.js";
import { createHttpError } from "../utils/httpError.js";

class OrdersService {
  async getAll() {
    return ordersRepository.getAll();
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "El ID del pedido no es válido", "BAD_REQUEST");
    }

    const order = await ordersRepository.getById(id);

    if (!order) {
      throw createHttpError(404, "Pedido no encontrado", "ORDER_NOT_FOUND");
    }

    return order;
  }

  async create(data = {}) {
    const { user, products, total, priority } = data;

    if (!user || !Array.isArray(products) || products.length === 0 || total === undefined || total === null) {
      throw createHttpError(400, "Faltan datos obligatorios del pedido", "REQUIRED_FIELDS");
    }

    if (!mongoose.isValidObjectId(user)) {
      throw createHttpError(400, "El usuario del pedido no es válido", "BAD_REQUEST");
    }

    if (!products.every(item =>
      item &&
      mongoose.isValidObjectId(item.product) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    )) {
      throw createHttpError(400, "Los productos del pedido no son válidos", "BAD_REQUEST");
    }

    if (typeof total !== "number" || !Number.isFinite(total) || total < 0) {
      throw createHttpError(400, "El total del pedido no es válido", "BAD_REQUEST");
    }

    if (priority !== undefined && !Object.values(ORDER_PRIORITY).includes(priority)) {
      throw createHttpError(400, "La prioridad del pedido no es válida", "BAD_REQUEST");
    }

    return ordersRepository.create({
      user,
      products,
      total,
      ...(priority !== undefined ? { priority } : {})
    });
  }

  async updateStatus(id, status) {
    await this.getById(id);

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw createHttpError(400, "El estado del pedido no es válido", "BAD_REQUEST");
    }

    return ordersRepository.updateStatus(id, status);
  }
}

export default new OrdersService();
