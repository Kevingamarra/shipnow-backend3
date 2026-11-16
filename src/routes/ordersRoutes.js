import { uploadOrderProof as multerOrderProof } from "../config/multer.config.js";
import { uploadOrderProof } from "../controllers/ordersController.js";
import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} from "../controllers/ordersController.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);


router.post(
  "/:id/proof",
  multerOrderProof,
  uploadOrderProof
);

export default router;
