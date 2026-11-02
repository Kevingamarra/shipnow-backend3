import Order from "../models/Order.js";

class OrdersRepository {
  async getAll() {
    return Order.find().sort({ createdAt: -1 });
  }

  async getById(id) {
    return Order.findById(id);
  }

  async create(data) {
    return Order.create(data);
  }

  async updateStatus(id, status) {
    return Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true }
    );
  }
}

export default new OrdersRepository();
