import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const { DB_HOST, DB_PORT, DB_PASSWORD, DB_USERNAME, DB_NAME, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5431"),
  database: DB_NAME,
  password: DB_PASSWORD,
  username: DB_USERNAME,

  synchronize: NODE_ENV === "dev" ? false : false,
  logging: NODE_ENV === "dev" ? false : false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migrations/*ts"],
  subscribers: [],
});
