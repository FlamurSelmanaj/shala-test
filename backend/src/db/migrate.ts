import "dotenv/config";
import { migrator } from "./migrator.ts";

const command = process.argv[2] ?? "up";

async function main() {
  if (command === "up") {
    await migrator.up();
  } else if (command === "down") {
    await migrator.down();
  } else {
    throw new Error(`Unknown migrate command: ${command}`);
  }
  console.log("Migrations complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
