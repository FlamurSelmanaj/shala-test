import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`site_settings\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`logo_media_id\` int unsigned DEFAULT NULL,
      \`phone\` varchar(64) DEFAULT NULL,
      \`email\` varchar(255) DEFAULT NULL,
      \`social_links\` json NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`logo_media_id\` (\`logo_media_id\`),
      CONSTRAINT \`site_settings_ibfk_1\` FOREIGN KEY (\`logo_media_id\`) REFERENCES \`media\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`site_settings_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`site_settings_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`tagline\` varchar(500) DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`site_settings_translations_site_settings_id_locale\` (\`site_settings_id\`,\`locale\`),
      CONSTRAINT \`site_settings_translations_ibfk_1\` FOREIGN KEY (\`site_settings_id\`) REFERENCES \`site_settings\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `site_settings_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `site_settings`");
}
