import {
  connectTestDatabase,
  disconnectTestDatabase,
  assertTestDatabase
} from "./testDatabase.js";

export const mochaGlobalSetup = async () => {
  await connectTestDatabase();
  assertTestDatabase();
};

export const mochaGlobalTeardown = async () => {
  await disconnectTestDatabase();
};
