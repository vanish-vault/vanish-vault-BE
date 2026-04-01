import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import * as Entities from "../entities/";

const isProduction = process.env.NODE_ENV === "production";

const baseOptions: DataSourceOptions = process.env.DATABASE_URL
  ? {
      type: "postgres",
      url: process.env.DATABASE_URL,
      // Railway's managed Postgres requires SSL
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    }
  : {
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

export const AppDataSource = new DataSource({
  ...baseOptions,
  synchronize: false, // use migrations, never auto-sync in production
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
    isProduction ? "dist/config/migrations/*.js" : "src/config/migrations/*.ts",
  ],
  subscribers: [],
});
