import dotenv from "dotenv";

dotenv.config();

const mongoUriFromEnv = process.env.MONGO_URI ?? process.env.MONGODB_URI;
if (!mongoUriFromEnv) {
  throw new Error("Missing required environment variable: set MONGO_URI or MONGODB_URI in .env");
}

const parseBoolean = (value: string | undefined, fallback = false): boolean => {
  if (!value) {
    return fallback;
  }
  return value.toLowerCase() === "true";
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  mongoUri: mongoUriFromEnv,
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  startWithoutDb: parseBoolean(process.env.START_WITHOUT_DB, false)
};
