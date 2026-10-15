import { Router } from "express";

import {
  getMockUsers,
  getMockDrivers,
  getMockOrders,
  getMockDeliveries,
  seedUsers
} from "../controllers/mocks.controller.js";

const router = Router();

router.get("/users", getMockUsers);
router.get("/drivers", getMockDrivers);
router.get("/orders", getMockOrders);
router.get("/deliveries", getMockDeliveries);

router.post("/seed", seedUsers);

export default router;
