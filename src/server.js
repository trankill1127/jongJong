import express from "express";
import morgan from "morgan";
import path from "path"; // Import path module to work with file paths
import globalRouter from "./routers/globalRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.use(logger);
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
// Serve static files from the "image" folder
app.use("/", globalRouter);
app.use("/image", express.static(path.join(__dirname, "image")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/client", express.static(path.join(__dirname, "client")));

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
