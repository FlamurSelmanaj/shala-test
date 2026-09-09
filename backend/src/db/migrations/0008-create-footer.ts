import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`footer_columns\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`footer_column_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`footer_column_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`footer_column_translations_footer_column_id_locale\` (\`footer_column_id\`,\`locale\`),
      CONSTRAINT \`footer_column_translations_ibfk_1\` FOREIGN KEY (\`footer_column_id\`) REFERENCES \`footer_columns\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`footer_links\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`footer_column_id\` int unsigned NOT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`link_type\` enum('CATEGORY','PAGE','EXTERNAL') NOT NULL,
      \`category_id\` int unsigned DEFAULT NULL,
      \`page_id\` int unsigned DEFAULT NULL,
      \`external_url\` varchar(1024) DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`footer_column_id\` (\`footer_column_id\`),
      KEY \`category_id\` (\`category_id\`),
      KEY \`page_id\` (\`page_id\`),
      CONSTRAINT \`footer_links_ibfk_1\` FOREIGN KEY (\`footer_column_id\`) REFERENCES \`footer_columns\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`footer_links_ibfk_2\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT \`footer_links_ibfk_3\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`footer_link_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`footer_link_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`label\` varchar(255) NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`footer_link_translations_footer_link_id_locale\` (\`footer_link_id\`,\`locale\`),
      CONSTRAINT \`footer_link_translations_ibfk_1\` FOREIGN KEY (\`footer_link_id\`) REFERENCES \`footer_links\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `footer_link_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `footer_links`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `footer_column_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `footer_columns`");
}
