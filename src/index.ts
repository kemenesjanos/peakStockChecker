import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import express = require("express");
import "reflect-metadata";
import { errorHandler } from "./middleware/error.middleware";
import validateEnv from "./utils/validateEnv";
import { Request, Response } from "express";
import helmet from "helmet";
import cors = require("cors");

dotenv.config();
validateEnv();

const app = express();
app.use(express.json());
app.use(errorHandler);
app.use(helmet());
app.use(cors());
const { PORT = 3000 } = process.env;

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
