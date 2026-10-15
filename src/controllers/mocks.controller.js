import mocksService from "../services/mocks.service.js";
import mocksRepository from "../repositories/mocks.repository.js";

const getQty = (req, res) => {
  const qty = Number(req.query.qty ?? 1);

  if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
    res.status(400).json({
      status: "error",
      message: "qty debe ser un número entero entre 1 y 100"
    });
    return null;
  }

  return qty;
};

export const getMockUsers = (req, res, next) => {
  try {
    const qty = getQty(req, res);

    if (qty === null) return;

    const users = mocksService.generateUsers(qty).map(
      ({ password, ...user }) => user
    );

    res.json({
      status: "success",
      payload: users
    });
  } catch (error) {
    next(error);
  }
};

export const seedUsers = async (req, res, next) => {
  try {
    const qty = getQty(req, res);

    if (qty === null) return;

    const users = mocksService.generateUsers(qty);
    const drivers = mocksService.generateDrivers(qty);

    const insertedUsers = await mocksRepository.insertUsers(users);
    const insertedDrivers = await mocksRepository.insertUsers(drivers);

    const ordersData = insertedUsers.map((user) =>
      mocksService.generateOrders(1, user._id)[0]
    );

    const insertedOrders = await mocksRepository.insertOrders(ordersData);

    const deliveriesData = insertedOrders.map((order, index) =>
      mocksService.generateDeliveries(
        1,
        order._id,
        insertedDrivers[index % insertedDrivers.length]._id
      )[0]
    );

    const insertedDeliveries =
      await mocksRepository.insertDeliveries(deliveriesData);

    res.status(201).json({
      status: "success",
      usuarios: insertedUsers.length,
      repartidores: insertedDrivers.length,
      pedidos: insertedOrders.length,
      entregas: insertedDeliveries.length
    });
  } catch (error) {
    next(error);
  }
};
