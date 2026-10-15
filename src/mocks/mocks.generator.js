import {
  ROLES,
  ORDER_STATUS,
  ORDER_PRIORITY
} from "../constants/index.js";

import { createHash } from "../utils/hash.js";

const names = [
  "Ana",
  "Luis",
  "Carlos",
  "María",
  "Sofía"
];

const lastNames = [
  "Pérez",
  "Gómez",
  "Rodríguez",
  "López",
  "Martínez"
];

const randomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const uniqueId = () =>
  `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

export const generateMockUser = () => ({
  first_name: randomItem(names),
  last_name: randomItem(lastNames),
  email: `user${uniqueId()}@test.com`,
  password: createHash("123456"),
  role: ROLES.USER
});

export const generateMockDriver = () => ({
  first_name: randomItem(names),
  last_name: randomItem(lastNames),
  email: `driver${uniqueId()}@test.com`,
  password: createHash("123456"),
  role: ROLES.DRIVER
});

export const generateMockOrder = (userId) => ({
  user: userId,
  products: [],
  status: ORDER_STATUS.PENDING,
  priority: ORDER_PRIORITY.MEDIUM,
  total: 1000
});

export const generateMockDelivery = (orderId, driverId) => ({
  order: orderId,
  driver: driverId,
  status: ORDER_STATUS.PENDING
});
