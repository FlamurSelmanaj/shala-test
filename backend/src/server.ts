import app from "./app.ts";
import { env } from "./config/env.ts";
import { sequelize } from "./db/models/index.ts";
import { runMigrations } from "./db/migrator.ts";

async function main(): Promise<void> {
  await sequelize.authenticate();
  await runMigrations();

  // Passenger (GoDaddy cPanel) injects PORT itself; env.PORT is the local-dev default.
  const port = Number(process.env.PORT) || env.PORT;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
