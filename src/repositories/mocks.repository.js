import User from "../models/User.js";
import Order from "../models/Order.js";
import Delivery from "../models/Delivery.js";

class MocksRepository {
  async insertUsers(users, session) {
    return User.insertMany(users, { session });
  }

  async insertOrders(orders, session) {
    return Order.insertMany(orders, { session });
  }

  async insertDeliveries(deliveries, session) {
    return Delivery.insertMany(deliveries, { session });
  }
}

export default new MocksRepository();
