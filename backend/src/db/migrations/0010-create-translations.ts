import type { QueryInterface } from "sequelize";

/** Companion table (new): a flat locale -> {key: string} dictionary for generic UI
 * copy that isn't tied to any single entity in the real schema (nav labels, aria
 * strings, footer compliance text, route titles, etc). See tasks/compact-2026-09-09.md. */
export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`translations\` (
      \`lang\` varchar(5) NOT NULL,
      \`data\` json NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`lang\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `translations`");
}
