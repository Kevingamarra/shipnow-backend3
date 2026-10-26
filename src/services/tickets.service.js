import {
  ROLES,
  EVENT_STATUS,
  TICKET_STATUS
} from "../constants/index.js";

import crypto from "crypto";

import ticketsRepository from "../repositories/tickets.repository.js";
import eventsRepository from "../repositories/events.repository.js";
import usersRepository from "../repositories/users.repository.js";
import { sendTicketEmail } from "../utils/email.js";
import logger from "../utils/logger.js";
import { createHttpError } from "../utils/httpError.js";

class TicketsService {
  async create(userId, eventId, quantity) {
    const event = await eventsRepository.getById(eventId);

    if (!event) {
      throw createHttpError(404, "Evento no encontrado", "EVENT_NOT_FOUND");
    }

    if (event.status === EVENT_STATUS.CANCELLED) {
      throw createHttpError(400, "El evento está cancelado", "EVENT_CANCELLED");
    }

    if (event.status === EVENT_STATUS.FINISHED) {
      throw createHttpError(400, "El evento ya finalizó", "EVENT_FINISHED");
    }

    if (event.status !== EVENT_STATUS.PUBLISHED) {
      throw createHttpError(400, "El evento no está publicado", "EVENT_NOT_PUBLISHED");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw createHttpError(400, "La cantidad debe ser un entero mayor a 0", "INVALID_TICKET_QUANTITY");
    }

    const existingTicket =
      await ticketsRepository.getActiveByUserAndEvent(
        userId,
        eventId
      );

    if (existingTicket) {
      throw createHttpError(
        409,
        "Ya tenés una inscripción activa para este evento",
        "DUPLICATE_ACTIVE_TICKET"
      );
    }

    const activeTickets =
      await ticketsRepository.getConfirmedByEvent(eventId);

    const occupiedSeats = activeTickets.reduce(
      (total, ticket) => total + ticket.quantity,
      0
    );

    if (occupiedSeats + quantity > event.capacity) {
      throw createHttpError(409, "No hay cupos suficientes", "INSUFFICIENT_CAPACITY");
    }

    const reservationCode = crypto.randomUUID();

    const ticket = await ticketsRepository.create({
      user: userId,
      event: eventId,
      quantity,
      reservationCode
    });

    logger.info("Ticket creado correctamente", {
      ticketId: ticket._id.toString(),
      eventId: eventId.toString(),
      userId: userId.toString(),
      quantity
    });

    const user = await usersRepository.getById(userId);

    if (user) {
      try {
        await sendTicketEmail(
          user.email,
          event,
          reservationCode
        );
      } catch (error) {
        logger.error("Error enviando email de ticket", { message: error.message });
      }
    }

    return ticket;
  }

  async getMyTickets(userId) {
    return await ticketsRepository.getByUser(userId);
  }

  async getEventTickets(eventId, user) {
    const event = await eventsRepository.getById(eventId);

    if (!event) {
      throw createHttpError(
        404,
        "Evento no encontrado",
        "EVENT_NOT_FOUND"
      );
    }

    if (
      user.role === ROLES.ORGANIZER &&
      event.organizer._id.toString() !== user.id
    ) {
      throw createHttpError(
        403,
        "No tenés permisos para ver los tickets de este evento",
        "FORBIDDEN"
      );
    }

    return await ticketsRepository.getByEvent(eventId);
  }

  async cancel(ticketId, user) {
    const ticket = await ticketsRepository.getById(ticketId);

    if (!ticket) {
      throw createHttpError(404, "Ticket no encontrado", "TICKET_NOT_FOUND");
    }

    if (ticket.status === TICKET_STATUS.CANCELLED) {
      throw createHttpError(409, "El ticket ya está cancelado", "TICKET_ALREADY_CANCELLED");
    }

    if (
      user.role !== ROLES.ADMIN &&
      ticket.user._id.toString() !== user.id
    ) {
      throw createHttpError(
        403,
        "No tenés permisos para cancelar este ticket",
        "TICKET_FORBIDDEN"
      );
    }

    return await ticketsRepository.update(ticketId, {
      status: TICKET_STATUS.CANCELLED,
      cancelledAt: new Date()
    });
  }
}

export default new TicketsService();
