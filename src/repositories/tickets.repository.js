import { TICKET_STATUS } from "../constants/index.js";

import Ticket from "../models/Ticket.js";

class TicketsRepository {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getById(id) {
    return await Ticket.findById(id)
      .populate("user", "first_name last_name email")
      .populate("event");
  }

  async getByUser(userId) {
    return await Ticket.find({
      user: userId
    }).populate(
      "event",
      "title date location"
    );
  }

  async getByEvent(eventId) {
    return await Ticket.find({
      event: eventId
    }).populate(
      "user",
      "first_name last_name email"
    );
  }

  async getActiveByUserAndEvent(userId, eventId) {
    return await Ticket.findOne({
      user: userId,
      event: eventId,
      status: {
        $ne: TICKET_STATUS.CANCELLED
      }
    });
  }

  async getConfirmedByEvent(eventId) {
    return await Ticket.find({
      event: eventId,
      status: {
        $ne: TICKET_STATUS.CANCELLED
      }
    });
  }

  async update(id, data) {
    return await Ticket.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    );
  }
}

export default new TicketsRepository();
