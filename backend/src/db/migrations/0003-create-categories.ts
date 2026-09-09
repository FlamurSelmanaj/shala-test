import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`categories\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`slug\` varchar(255) NOT NULL,
      \`icon\` varchar(1024) DEFAULT NULL,
      \`parent_id\` int unsigned DEFAULT NULL,
      \`image_id\` int unsigned DEFAULT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`),
      KEY \`parent_id\` (\`parent_id\`),
      KEY \`image_id\` (\`image_id\`),
      CONSTRAINT \`categories_ibfk_1\` FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT \`categories_ibfk_2\` FOREIGN KEY (\`image_id\`) REFERENCES \`media\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`category_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`category_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`description\` text,
      \`meta_title\` varchar(255) DEFAULT NULL,
      \`meta_description\` varchar(500) DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`category_translations_category_id_locale\` (\`category_id\`,\`locale\`),
      CONSTRAINT \`category_translations_ibfk_1\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `category_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `categories`");
}
