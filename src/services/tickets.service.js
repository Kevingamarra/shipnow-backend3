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
import { createHttpError } from "../utils/httpError.js";

class TicketsService {
  async create(userId, eventId, quantity) {
    const event = await eventsRepository.getById(eventId);

    if (!event) {
      throw createHttpError(404, "Evento no encontrado");
    }

    if (event.status === EVENT_STATUS.CANCELLED) {
      throw createHttpError(400, "El evento está cancelado");
    }

    if (event.status === EVENT_STATUS.FINISHED) {
      throw createHttpError(400, "El evento ya finalizó");
    }

    if (event.status !== EVENT_STATUS.PUBLISHED) {
      throw createHttpError(400, "El evento no está publicado");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw createHttpError(400, "La cantidad debe ser un entero mayor a 0");
    }

    const existingTicket =
      await ticketsRepository.getActiveByUserAndEvent(
        userId,
        eventId
      );

    if (existingTicket) {
      throw createHttpError(
        409,
        "Ya tenés una inscripción activa para este evento"
      );
    }

    const activeTickets =
      await ticketsRepository.getConfirmedByEvent(eventId);

    const occupiedSeats = activeTickets.reduce(
      (total, ticket) => total + ticket.quantity,
      0
    );

    if (occupiedSeats + quantity > event.capacity) {
      throw createHttpError(409, "No hay cupos suficientes");
    }

    const reservationCode = crypto.randomUUID();

    const ticket = await ticketsRepository.create({
      user: userId,
      event: eventId,
      quantity,
      reservationCode
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
        console.error("Error enviando email:", error.message);
      }
    }

    return ticket;
  }

  async getMyTickets(userId) {
    return await ticketsRepository.getByUser(userId);
  }

  async getEventTickets(eventId) {
    return await ticketsRepository.getByEvent(eventId);
  }

  async cancel(ticketId, user) {
    const ticket = await ticketsRepository.getById(ticketId);

    if (!ticket) {
      throw createHttpError(404, "Ticket no encontrado");
    }

    if (ticket.status === TICKET_STATUS.CANCELLED) {
      throw createHttpError(409, "El ticket ya está cancelado");
    }

    if (
      user.role !== ROLES.ADMIN &&
      ticket.user._id.toString() !== user.id
    ) {
      throw createHttpError(
        403,
        "No tenés permisos para cancelar este ticket"
      );
    }

    return await ticketsRepository.update(ticketId, {
      status: TICKET_STATUS.CANCELLED,
      cancelledAt: new Date()
    });
  }
}

export default new TicketsService();
