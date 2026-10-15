export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  ORGANIZER: "ORGANIZER",
  USER: "USER",
  DRIVER: "DRIVER"
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "AVAILABLE",
  OUT_OF_STOCK: "OUT_OF_STOCK"
});

export const ORDER_STATUS = Object.freeze({
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
});

export const ORDER_PRIORITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
});

export const TICKET_STATUS = Object.freeze({
  CONFIRMED: "confirmed",
  PENDING: "pending",
  CANCELLED: "cancelled"
});

export const EVENT_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
  CANCELLED: "cancelled",
  FINISHED: "finished"
});
