import express from "express";

import { getUsers } from "../controllers/usersController.js";
import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { ROLES } from "../constants/index.js";

const router = express.Router();

router.get(
  "/",
  auth,
  authorize(ROLES.ADMIN),
  getUsers
);

export default router;
