import { pathToFileURL } from "node:url";
import { Umzug, SequelizeStorage } from "umzug";
import { sequelize } from "./connection.ts";

export const umzug = new Umzug({
  migrations: {
    glob: ["migrations/*.ts", { cwd: import.meta.dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export async function runMigrations(): Promise<void> {
  const pending = await umzug.pending();
  if (pending.length === 0) return;
  console.log(`Running ${pending.length} pending migration(s)...`);
  await umzug.up();
}

const isCliEntryPoint = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliEntryPoint) {
  const command = process.argv[2];

  (async () => {
    if (command === "up") {
      await umzug.up();
    } else if (command === "down") {
      await umzug.down();
    } else {
      console.error("Usage: tsx src/db/migrator.ts <up|down>");
      process.exitCode = 1;
      return;
    }
    await sequelize.close();
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
