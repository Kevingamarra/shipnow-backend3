import User from "../models/User.js";
import Order from "../models/Order.js";
import Delivery from "../models/Delivery.js";

class MocksRepository {

  async insertUsers(users) {
    return await User.insertMany(users);
  }

  async insertOrders(orders) {
    return await Order.insertMany(orders);
  }

  async insertDeliveries(deliveries) {
    return await Delivery.insertMany(deliveries);
  }
}

export default new MocksRepository();
