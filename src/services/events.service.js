import eventsRepository from "../repositories/events.repository.js";
import { EVENT_STATUS } from "../constants/index.js";
import { createHttpError } from "../utils/httpError.js";

class EventsService {
  async getAll(query) {
    const filters = {};

    if (query.status) {
      filters.status = query.status;
    }

    if (query.category) {
      filters.category = query.category;
    }

    if (query.location) {
      filters.location = query.location;
    }

    if (query.dateFrom || query.dateTo) {
      filters.date = {};

      if (query.dateFrom) {
        filters.date.$gte = new Date(query.dateFrom);
      }

      if (query.dateTo) {
        filters.date.$lte = new Date(query.dateTo);
      }
    }

    const options = {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sort: query.sort || "date"
    };

    return await eventsRepository.getAll(filters, options);
  }

  async getById(id) {
    return await eventsRepository.getById(id);
  }

  async create(eventData) {
    if (!eventData.date || Number.isNaN(new Date(eventData.date).getTime())) {
      throw createHttpError(400, "La fecha del evento es inválida", "INVALID_EVENT_DATE");
    }

    if (new Date(eventData.date) < new Date()) {
      throw createHttpError(400, "La fecha del evento no puede ser pasada", "EVENT_DATE_PASSED");
    }

    if (!Number.isFinite(Number(eventData.capacity)) || Number(eventData.capacity) <= 0) {
      throw createHttpError(400, "La capacidad debe ser mayor a 0", "INVALID_EVENT_CAPACITY");
    }

    if (!Number.isFinite(Number(eventData.price)) || Number(eventData.price) < 0) {
      throw createHttpError(400, "El precio no puede ser negativo", "INVALID_EVENT_PRICE");
    }

    return await eventsRepository.create(eventData);
  }

  async update(id, eventData) {
    const event = await eventsRepository.getById(id);

    if (!event) {
      throw createHttpError(404, "Evento no encontrado", "EVENT_NOT_FOUND");
    }

    if (event.status === EVENT_STATUS.CANCELLED) {
      throw createHttpError(400, "No se puede modificar un evento cancelado", "EVENT_CANCELLED");
    }

    if (
      eventData.capacity !== undefined &&
      (!Number.isFinite(Number(eventData.capacity)) ||
        Number(eventData.capacity) <= 0)
    ) {
      throw createHttpError(400, "La capacidad debe ser mayor a 0", "INVALID_EVENT_CAPACITY");
    }

    if (
      eventData.price !== undefined &&
      (!Number.isFinite(Number(eventData.price)) ||
        Number(eventData.price) < 0)
    ) {
      throw createHttpError(400, "El precio no puede ser negativo", "INVALID_EVENT_PRICE");
    }

    return await eventsRepository.update(id, eventData);
  }

  async updateStatus(id, status) {
    const event = await eventsRepository.getById(id);

    if (!event) {
      throw createHttpError(404, "Evento no encontrado", "EVENT_NOT_FOUND");
    }

    if (event.status === EVENT_STATUS.CANCELLED) {
      throw createHttpError(400, "No se puede cambiar el estado de un evento cancelado", "EVENT_CANCELLED");
    }

    if (
      status === EVENT_STATUS.PUBLISHED &&
      (event.status === EVENT_STATUS.FINISHED ||
        event.status === EVENT_STATUS.CANCELLED)
    ) {
      throw createHttpError(400, "No se puede publicar un evento finalizado o cancelado", "EVENT_CANCELLED");
    }

    return await eventsRepository.updateStatus(id, status);
  }

  async delete(id) {
    return await eventsRepository.delete(id);
  }
}

export default new EventsService();
