import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`media\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`filename\` varchar(255) NOT NULL,
      \`original_filename\` varchar(255) NOT NULL,
      \`url\` varchar(1024) NOT NULL,
      \`mime_type\` varchar(127) NOT NULL,
      \`size\` int unsigned NOT NULL,
      \`width\` int unsigned DEFAULT NULL,
      \`height\` int unsigned DEFAULT NULL,
      \`folder\` varchar(255) DEFAULT NULL,
      \`storage_provider\` varchar(32) NOT NULL DEFAULT 'LOCAL',
      \`storage_key\` varchar(255) DEFAULT NULL,
      \`uploaded_by_id\` int unsigned DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`uploaded_by_id\` (\`uploaded_by_id\`),
      CONSTRAINT \`media_ibfk_1\` FOREIGN KEY (\`uploaded_by_id\`) REFERENCES \`admins\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`asset_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`asset_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`alt_text\` varchar(255) DEFAULT NULL,
      \`caption\` varchar(500) DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`asset_translations_asset_id_locale\` (\`asset_id\`,\`locale\`),
      CONSTRAINT \`asset_translations_ibfk_1\` FOREIGN KEY (\`asset_id\`) REFERENCES \`media\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `asset_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `media`");
}
