import eventsService from "../services/events.service.js";
import eventDTO from "../dto/event.dto.js";

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
    const updatedEvent = await eventsService.update(
      req.params.id,
      req.body,
      req.user
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
    const updatedEvent = await eventsService.updateStatus(
      req.params.id,
      req.body.status,
      req.user
    );

    res.json({
      status: "success",
      payload: eventDTO(updatedEvent)
    });
  } catch (error) {
    next(error);
  }
};
