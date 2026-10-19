import { ROLES } from "../constants/index.js";
import eventsService from "../services/events.service.js";
import eventDTO from "../dto/event.dto.js";
import { createHttpError } from "../utils/httpError.js";

export const getEvents = async (req, res, next) => {
  try {
    const events = await eventsService.getAll(req.query);

    res.json({
      status: "success",
      ...events,
      data: events.data.map(eventDTO)
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await eventsService.getById(req.params.id);

    if (!event) {
      throw createHttpError(
        404,
        "Evento no encontrado",
        "EVENT_NOT_FOUND"
      );
    }

    res.json({
      status: "success",
      payload: eventDTO(event)
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventsService.create({
      ...req.body,
      organizer: req.user.id
    });

    res.status(201).json({
      status: "success",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await eventsService.getById(req.params.id);

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
        "No tenés permisos para modificar este evento",
        "FORBIDDEN"
      );
    }

    const updatedEvent = await eventsService.update(
      req.params.id,
      req.body
    );

    res.json({
      status: "success",
      payload: eventDTO(updatedEvent)
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const event = await eventsService.getById(req.params.id);

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
        "No tenés permisos para modificar este evento",
        "FORBIDDEN"
      );
    }

    const updatedEvent = await eventsService.updateStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      status: "success",
      payload: eventDTO(updatedEvent)
    });
  } catch (error) {
    next(error);
  }
};
