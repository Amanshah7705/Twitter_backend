import dotenv from "dotenv";
import ConnectDB from "./databases/index.js";
import { app } from "./app.js";
import { server } from "./controllers/chat.controller.js";
dotenv.config({
  path: "./.env",
});
const port = process.env.PORT;
const port2 = process.env.PORT2;
ConnectDB()
  .then(() => {
    app.listen(port);
    server.listen(port2);
  })
  .catch();
