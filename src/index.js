import dotenv from "dotenv";
import ConnectDB from "./databases/index.js";
import { app } from "./app.js";
import { server } from "./controllers/chat.controller.js";
import {server2} from "../src/controllers/group.controller.js"
dotenv.config({
  path: "./.env",
});
const port = process.env.PORT;
const port2 = process.env.PORT2;
const port3 = process.env.PORT3
ConnectDB()
  .then(() => {
    app.listen(port);
    server.listen(port2);
    server2.listen(port3)
  })
  .catch();
