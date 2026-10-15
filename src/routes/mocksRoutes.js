import { Router } from "express";

import {
  getMockUsers,
  seedUsers
} from "../controllers/mocks.controller.js";

const router = Router();

router.get("/users", getMockUsers);

router.post("/seed", seedUsers);

export default router;
