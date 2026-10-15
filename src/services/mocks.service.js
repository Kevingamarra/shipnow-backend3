import {
  generateMockUser,
  generateMockDriver,
  generateMockOrder,
  generateMockDelivery
} from "../mocks/mocks.generator.js";

import mocksRepository from "../repositories/mocks.repository.js";

class MocksService {
  generateUsers(qty = 1) {
    return Array.from({ length: qty }, () => generateMockUser());
  }

  generateDrivers(qty = 1) {
    return Array.from({ length: qty }, () => generateMockDriver());
  }

  generateOrders(qty = 1, userId) {
    return Array.from({ length: qty }, () => generateMockOrder(userId));
  }

  generateDeliveries(qty = 1, orderId, driverId) {
    return Array.from(
      { length: qty },
      () => generateMockDelivery(orderId, driverId)
    );
  }

  async seed(qty) {
    const users = this.generateUsers(qty);
    const drivers = this.generateDrivers(qty);

    const insertedUsers = await mocksRepository.insertUsers(users);
    const insertedDrivers = await mocksRepository.insertUsers(drivers);

    const ordersData = insertedUsers.map((user) =>
      this.generateOrders(1, user._id)[0]
    );

    const insertedOrders = await mocksRepository.insertOrders(ordersData);

    const deliveriesData = insertedOrders.map((order, index) =>
      this.generateDeliveries(
        1,
        order._id,
        insertedDrivers[index % insertedDrivers.length]._id
      )[0]
    );

    const insertedDeliveries =
      await mocksRepository.insertDeliveries(deliveriesData);

    return {
      usuarios: insertedUsers.length,
      repartidores: insertedDrivers.length,
      pedidos: insertedOrders.length,
      entregas: insertedDeliveries.length
    };
  }
}

export default new MocksService();
