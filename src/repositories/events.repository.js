import Event from "../models/Event.js";

class EventsRepository {
  async getAll(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = "date"
    } = options;

    const skip = (page - 1) * limit;
    const total = await Event.countDocuments(filters);

    const data = await Event.find(filters)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(limit)
      .populate("organizer", "first_name last_name email");

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getById(id) {
    return await Event.findById(id).populate(
      "organizer",
      "first_name last_name email"
    );
  }

  async create(eventData) {
    return await Event.create(eventData);
  }

  async update(id, eventData) {
    return await Event.findByIdAndUpdate(
      id,
      eventData,
      { new: true, runValidators: true }
    );
  }

  async updateStatus(id, status) {
    return await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Event.findByIdAndDelete(id);
  }
}

export default new EventsRepository();
