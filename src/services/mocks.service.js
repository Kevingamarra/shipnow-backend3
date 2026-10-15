import {
  generateMockUser,
  generateMockDriver,
  generateMockOrder,
  generateMockDelivery
} from "../mocks/mocks.generator.js";

class MocksService {

  generateUsers(qty = 1) {
    return Array.from(
      { length: qty },
      () => generateMockUser()
    );
  }

  generateDrivers(qty = 1) {
    return Array.from(
      { length: qty },
      () => generateMockDriver()
    );
  }

  generateOrders(qty = 1, userId) {
    return Array.from(
      { length: qty },
      () => generateMockOrder(userId)
    );
  }

  generateDeliveries(qty = 1, orderId, driverId) {
    return Array.from(
      { length: qty },
      () => generateMockDelivery(orderId, driverId)
    );
  }
}

export default new MocksService();
