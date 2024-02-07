import dotenv from "dotenv";
import ConnectDB from "./databases/index.js";
import { server } from "./controllers/chat.controller.js";
dotenv.config({
  path: "./.env",
});
const port = process.env.PORT;
ConnectDB()
  .then(() => {
    server.listen(port);
  })
  .catch();
