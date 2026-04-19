import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
import { runSocket } from "./sockeio/index.js";

const app = express();
const port = process.env.PORT;
dotenv.config();
bootstrap(app, express);

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

runSocket(server);
