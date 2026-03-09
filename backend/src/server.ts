import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./database/db";

const startHttpServer = (): void => {
  app.listen(env.port, () => {
    console.info(`Server listening on port ${env.port}`);
  });
};

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    if (!env.startWithoutDb) {
      throw new Error(
        `Database connection failed. Set START_WITHOUT_DB=true to boot without MongoDB. Root error: ${message}`
      );
    }

    console.warn(`Database connection failed, continuing without DB because START_WITHOUT_DB=true. ${message}`);
  }

  startHttpServer();
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
