import mongoose from "mongoose";

import {
  generateMockUser,
  generateMockDriver,
  generateMockOrder,
  generateMockDelivery
} from "../mocks/mocks.generator.js";

import mocksRepository from "../repositories/mocks.repository.js";
import { createHttpError } from "../utils/httpError.js";
import logger from "../utils/logger.js";

class MocksService {
  validateQty(value = 1) {
    const qty = Number(value);

    if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
      logger.warning("Cantidad inválida solicitada para mocks", { value });
      throw createHttpError(
        400,
        "qty debe ser un número entero entre 1 y 100",
        "INVALID_MOCK_QTY"
      );
    }

    return qty;
  }

  generateUsers(qty = 1) {
    qty = this.validateQty(qty);
    const result = Array.from({ length: qty }, () => generateMockUser());
    logger.debug("Usuarios mock generados", { quantity: result.length });
    return result;
  }

  generateDrivers(qty = 1) {
    qty = this.validateQty(qty);
    const result = Array.from({ length: qty }, () => generateMockDriver());
    logger.debug("Repartidores mock generados", { quantity: result.length });
    return result;
  }

  generateOrders(qty = 1, userId) {
    qty = this.validateQty(qty);
    const result = Array.from({ length: qty }, () => generateMockOrder(userId));
    logger.debug("Pedidos mock generados", { quantity: result.length });
    return result;
  }

  generateDeliveries(qty = 1, orderId, driverId) {
    qty = this.validateQty(qty);

    const result = Array.from(
      { length: qty },
      () => generateMockDelivery(orderId, driverId)
    );
    logger.debug("Entregas mock generadas", { quantity: result.length });
    return result;
  }

  async seed(qty = 1) {
    qty = this.validateQty(qty);

    const session = await mongoose.startSession();

    try {
      let result;

      await session.withTransaction(async () => {
        const users = this.generateUsers(qty);
        const drivers = this.generateDrivers(qty);

        const insertedUsers =
          await mocksRepository.insertUsers(users, session);

        const insertedDrivers =
          await mocksRepository.insertUsers(drivers, session);

        const ordersData = insertedUsers.map((user) =>
          generateMockOrder(user._id)
        );

        const insertedOrders =
          await mocksRepository.insertOrders(ordersData, session);

        const deliveriesData = insertedOrders.map((order, index) =>
          generateMockDelivery(
            order._id,
            insertedDrivers[index]._id
          )
        );

        const insertedDeliveries =
          await mocksRepository.insertDeliveries(
            deliveriesData,
            session
          );

        result = {
          usuarios: insertedUsers.length,
          repartidores: insertedDrivers.length,
          pedidos: insertedOrders.length,
          entregas: insertedDeliveries.length
        };
      });

      logger.info("Seed de datos mock completado", result);
      return result;
    } catch (error) {
      logger.error("Falló el seed de datos mock", { message: error.message });
      if (error?.name === "CustomError") {
        throw error;
      }

      throw createHttpError(
        500,
        "No se pudieron insertar los datos de prueba",
        "MOCK_SEED_FAILED"
      );
    } finally {
      await session.endSession();
    }
  }
}

export default new MocksService();
