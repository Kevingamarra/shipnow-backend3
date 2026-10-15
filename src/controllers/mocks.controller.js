import mongoose from "mongoose";
import mocksService from "../services/mocks.service.js";

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

const removePasswords = (users) =>
  users.map(({ password, ...user }) => user);

export const getMockUsers = (req, res, next) => {
  try {
    const qty = getQty(req, res);
    if (qty === null) return;

    res.json({
      status: "success",
      payload: removePasswords(mocksService.generateUsers(qty))
    });
  } catch (error) {
    next(error);
  }
};

export const getMockDrivers = (req, res, next) => {
  try {
    const qty = getQty(req, res);
    if (qty === null) return;

    res.json({
      status: "success",
      payload: removePasswords(mocksService.generateDrivers(qty))
    });
  } catch (error) {
    next(error);
  }
};

export const getMockOrders = (req, res, next) => {
  try {
    const qty = getQty(req, res);
    if (qty === null) return;

    const payload = Array.from({ length: qty }, () =>
      mocksService.generateOrders(
        1,
        new mongoose.Types.ObjectId()
      )[0]
    );

    res.json({
      status: "success",
      payload
    });
  } catch (error) {
    next(error);
  }
};

export const getMockDeliveries = (req, res, next) => {
  try {
    const qty = getQty(req, res);
    if (qty === null) return;

    const payload = Array.from({ length: qty }, () =>
      mocksService.generateDeliveries(
        1,
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      )[0]
    );

    res.json({
      status: "success",
      payload
    });
  } catch (error) {
    next(error);
  }
};

export const seedUsers = async (req, res, next) => {
  try {
    const qty = getQty(req, res);
    if (qty === null) return;

    const result = await mocksService.seed(qty);

    res.status(201).json({
      status: "success",
      ...result
    });
  } catch (error) {
    next(error);
  }
};
