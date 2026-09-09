import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`navigation_items\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`parent_id\` int unsigned DEFAULT NULL,
      \`link_type\` enum('CATEGORY','PAGE','EXTERNAL') NOT NULL,
      \`category_id\` int unsigned DEFAULT NULL,
      \`page_id\` int unsigned DEFAULT NULL,
      \`external_url\` varchar(1024) DEFAULT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
      \`open_in_new_tab\` tinyint(1) NOT NULL DEFAULT '0',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`parent_id\` (\`parent_id\`),
      KEY \`category_id\` (\`category_id\`),
      KEY \`page_id\` (\`page_id\`),
      CONSTRAINT \`navigation_items_ibfk_1\` FOREIGN KEY (\`parent_id\`) REFERENCES \`navigation_items\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT \`navigation_items_ibfk_2\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT \`navigation_items_ibfk_3\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`navigation_item_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`navigation_item_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`label\` varchar(255) DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`navigation_item_translations_navigation_item_id_locale\` (\`navigation_item_id\`,\`locale\`),
      CONSTRAINT \`navigation_item_translations_ibfk_1\` FOREIGN KEY (\`navigation_item_id\`) REFERENCES \`navigation_items\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `navigation_item_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `navigation_items`");
}
