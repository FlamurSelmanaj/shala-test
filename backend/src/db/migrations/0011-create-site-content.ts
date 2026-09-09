import type { QueryInterface } from "sequelize";

/** Companion table (new): a singleton row (id always 1) holding the static site
 * chrome (logo/nav/hero slides/footer/etc — `content`), the language config
 * (`meta`), and the edit-only page shell records (`pages` — id/slug/titleKey/
 * subtitleKey/heroImage/sections) that the real `pages` table doesn't model.
 * See tasks/compact-2026-09-09.md. */
export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`site_content\` (
      \`id\` tinyint unsigned NOT NULL DEFAULT '1',
      \`content\` json NOT NULL,
      \`meta\` json NOT NULL,
      \`pages\` json NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `site_content`");
}
