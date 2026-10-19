import mongoose from "mongoose";
import mocksService from "../services/mocks.service.js";

const removePasswords = (users) =>
  users.map(({ password, ...user }) => user);

export const getMockUsers = (req, res, next) => {
  try {
    const qty = mocksService.validateQty(req.query.qty);

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
    const qty = mocksService.validateQty(req.query.qty);

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
    const qty = mocksService.validateQty(req.query.qty);

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
    const qty = mocksService.validateQty(req.query.qty);

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
    const qty = mocksService.validateQty(req.query.qty);
    const result = await mocksService.seed(qty);

    res.status(201).json({
      status: "success",
      ...result
    });
  } catch (error) {
    next(error);
  }
};
