import swaggerSpec from "./config/swagger.config.js";
import swaggerUi from "swagger-ui-express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import initializePassport from "./config/passport.config.js";

import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import sessionsRoutes from "./routes/sessionsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import mocksRoutes from "./routes/mocksRoutes.js";
import loggerRoutes from "./routes/loggerRoutes.js";

import { createHttpError } from "./utils/httpError.js";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import { injectLogger, httpLogger } from "./middlewares/httpLogger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(injectLogger);
app.use(httpLogger);

initializePassport();
app.use(passport.initialize());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor activo"
  });
});

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/mocks", mocksRoutes);
app.use("/api/logger", loggerRoutes);

app.use((req, res, next) => {
  logger.warning("Ruta inexistente", {
    method: req.method,
    path: req.originalUrl
  });

  next(createHttpError(404, "Ruta no encontrada", "RESOURCE_NOT_FOUND"));
});

app.use(errorHandler);

export default app;
