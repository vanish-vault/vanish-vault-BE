import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";
import secretsRoutes from "./routes/secrets.routes";
import fileRoutes from "./routes/file.routes";
import planRoutes from "./routes/plan.routes";
import paymentRoutes from "./routes/payment.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./handlers/error.handler";
import { initSwagger } from "./config/swagger";
import { startCleanupCron } from "./crons/cleanup.cron";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
// initialize swagger auto-generator before routes so it can instrument them
initSwagger(app);

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/secrets", secretsRoutes);
app.use("/v1/api/files", fileRoutes);
app.use("/v1/api/plans", planRoutes);
app.use("/v1/api/payment", paymentRoutes);
app.use("/v1/api/user", userRoutes);
// error handler (should come after routes)
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    startCleanupCron();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
