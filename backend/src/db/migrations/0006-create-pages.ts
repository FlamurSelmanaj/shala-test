import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`pages\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(255) NOT NULL,
      \`template\` varchar(100) DEFAULT NULL,
      \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
      \`published_at\` datetime DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`page_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`page_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`meta_title\` varchar(255) DEFAULT NULL,
      \`meta_description\` varchar(500) DEFAULT NULL,
      \`og_image_id\` int unsigned DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`page_translations_page_id_locale\` (\`page_id\`,\`locale\`),
      KEY \`og_image_id\` (\`og_image_id\`),
      CONSTRAINT \`page_translations_ibfk_1\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`page_translations_ibfk_2\` FOREIGN KEY (\`og_image_id\`) REFERENCES \`media\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`content_blocks\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`page_id\` int unsigned NOT NULL,
      \`type\` varchar(64) NOT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
      \`settings\` json NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`page_id\` (\`page_id\`),
      CONSTRAINT \`content_blocks_ibfk_1\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`content_block_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`block_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`data\` json NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`content_block_translations_block_id_locale\` (\`block_id\`,\`locale\`),
      CONSTRAINT \`content_block_translations_ibfk_1\` FOREIGN KEY (\`block_id\`) REFERENCES \`content_blocks\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `content_block_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `content_blocks`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `page_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `pages`");
}
