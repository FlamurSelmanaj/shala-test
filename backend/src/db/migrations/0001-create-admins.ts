import type { QueryInterface } from "sequelize";

/** Reconstructed from the live `shala_cms` schema (already applied there) so a fresh
 * database — e.g. on GoDaddy — gets the same schema via `npm run db:migrate`. */
export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`admins\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`email\` varchar(255) NOT NULL,
      \`password_hash\` varchar(255) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`role\` varchar(32) NOT NULL DEFAULT 'ADMIN',
      \`token_version\` int unsigned NOT NULL DEFAULT '0',
      \`failed_login_attempts\` int unsigned NOT NULL DEFAULT '0',
      \`locked_until\` datetime DEFAULT NULL,
      \`last_login_at\` datetime DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`email\` (\`email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `admins`");
}
