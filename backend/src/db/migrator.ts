import { SequelizeStorage, Umzug } from "umzug";
import { sequelize } from "./sequelize.ts";

export const migrator = new Umzug({
  migrations: { glob: "src/db/migrations/*.ts" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: "sequelize_meta" }),
  logger: console,
});
