import logger from "../utils/logger.js";
import ordersService from "../services/orders.service.js";

export const getOrders = async (req, res, next) => {
  try {
    const orders = await ordersService.getAll();
    res.json({ status: "success", payload: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await ordersService.getById(req.params.id);
    res.json({ status: "success", payload: order });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await ordersService.create(req.body);
    res.status(201).json({ status: "success", payload: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await ordersService.updateStatus(req.params.id, req.body?.status);
    res.json({ status: "success", payload: order });
  } catch (error) {
    next(error);
  }
};


export const uploadOrderProof = async (req, res, next) => {
  try {
    const order = await ordersService.addProof(
      req.params.id,
      req.file
    );

    (req.logger ?? logger).info("Comprobante de pedido cargado", {
      orderId: req.params.id,
      filename: req.file.filename
    });

    res.status(201).json({
      status: "success",
      message: "Comprobante cargado correctamente",
      payload: order
    });
  } catch (error) {
    next(error);
  }
};
