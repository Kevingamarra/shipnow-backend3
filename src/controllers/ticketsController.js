import { ROLES } from "../constants/index.js";
import ticketsService from "../services/tickets.service.js";
import eventsService from "../services/events.service.js";
import ticketDTO from "../dto/ticket.dto.js";
import { createHttpError } from "../utils/httpError.js";

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketsService.create(
      req.user.id,
      req.params.eid,
      req.body.quantity
    );

    res.status(201).json({
      status: "success",
      payload: ticketDTO(ticket)
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.getMyTickets(req.user.id);

    res.json({
      status: "success",
      payload: tickets.map(ticketDTO)
    });
  } catch (error) {
    next(error);
  }
};

export const getEventTickets = async (req, res, next) => {
  try {
    const event = await eventsService.getById(req.params.eid);

    if (!event) {
      throw createHttpError(
        404,
        "Evento no encontrado",
        "EVENT_NOT_FOUND"
      );
    }

    if (
      req.user.role === ROLES.ORGANIZER &&
      event.organizer._id.toString() !== req.user.id
    ) {
      throw createHttpError(
        403,
        "No tenés permisos para ver los tickets de este evento",
        "FORBIDDEN"
      );
    }

    const tickets = await ticketsService.getEventTickets(
      req.params.eid
    );

    res.json({
      status: "success",
      payload: tickets.map(ticketDTO)
    });
  } catch (error) {
    next(error);
  }
};

export const cancelTicket = async (req, res, next) => {
  try {
    const ticket = await ticketsService.cancel(
      req.params.tid,
      req.user
    );

    res.json({
      status: "success",
      payload: ticketDTO(ticket)
    });
  } catch (error) {
    next(error);
  }
};
