import express from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  updateEventStatus
} from "../controllers/eventsController.js";

import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { ROLES } from "../constants/index.js";

import {
  createTicket,
  getEventTickets
} from "../controllers/ticketsController.js";

const router = express.Router();

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  auth,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN),
  createEvent
);

router.put(
  "/:id",
  auth,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN),
  updateEvent
);

router.patch(
  "/:id/status",
  auth,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN),
  updateEventStatus
);

router.post(
  "/:eid/tickets",
  auth,
  createTicket
);

router.get(
  "/:eid/tickets",
  auth,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN),
  getEventTickets
);

export default router;
