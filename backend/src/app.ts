import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";
import { requestLogger } from "./middleware/requestLogger";
import orderRouter from "./routes/orderRoutes";

const app = express();
const frontendPath = path.resolve(process.cwd(), "frontend");

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin
  })
);
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/orders", orderRouter);
app.use(express.static(frontendPath));

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
