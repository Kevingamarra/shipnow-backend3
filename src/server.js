import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.config.js";

const PORT = env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
