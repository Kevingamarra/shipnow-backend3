import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.config.js";
import logger from "./utils/logger.js";

const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Servidor ShipNow escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.fatal("No se pudo iniciar el servidor", {
      message: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};

startServer();
