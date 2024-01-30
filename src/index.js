import dotenv from "dotenv";
import ConnectDB from "./databases/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});
const port = process.env.PORT;

ConnectDB()
  .then(() => {
    app.listen(port);
  })
  .catch();