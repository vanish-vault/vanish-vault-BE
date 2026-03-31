import "reflect-metadata";
import { DataSource } from "typeorm";
import * as Entities from "../entities/";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Set to false to use migrations
  logging: false,
  entities: [
    Entities.User,
    Entities.Secret,
    Entities.File,
    Entities.Session,
    Entities.Account,
    Entities.Plan,
    Entities.Webhook,
  ],
  migrations: [
    process.env.NODE_ENV === "production"
      ? "dist/config/migrations/*.js"
      : "src/config/migrations/*.ts",
  ],
  subscribers: [],
});
