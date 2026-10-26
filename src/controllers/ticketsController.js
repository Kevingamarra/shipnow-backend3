import ticketsService from "../services/tickets.service.js";
import ticketDTO from "../dto/ticket.dto.js";

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
    const tickets = await ticketsService.getEventTickets(
      req.params.eid,
      req.user
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
