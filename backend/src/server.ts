import "dotenv/config";
import app from "./app.ts";
import { sequelize } from "./db/sequelize.ts";

const PORT = Number(process.env.PORT) || 3000;

async function main() {
  await sequelize.authenticate();
  console.log("Database connection established.");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
