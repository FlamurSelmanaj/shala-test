import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`products\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`sku\` varchar(100) DEFAULT NULL,
      \`slug\` varchar(255) NOT NULL,
      \`category_id\` int unsigned NOT NULL,
      \`facet_values\` json NOT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`slug\` (\`slug\`),
      KEY \`category_id\` (\`category_id\`),
      CONSTRAINT \`products_ibfk_1\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`product_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`product_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`short_description\` varchar(500) DEFAULT NULL,
      \`description\` text,
      \`meta_title\` varchar(255) DEFAULT NULL,
      \`meta_description\` varchar(500) DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`product_translations_product_id_locale\` (\`product_id\`,\`locale\`),
      CONSTRAINT \`product_translations_ibfk_1\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`product_images\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`product_id\` int unsigned NOT NULL,
      \`media_id\` int unsigned NOT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`is_primary\` tinyint(1) NOT NULL DEFAULT '0',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`product_id\` (\`product_id\`),
      KEY \`media_id\` (\`media_id\`),
      CONSTRAINT \`product_images_ibfk_1\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`product_images_ibfk_2\` FOREIGN KEY (\`media_id\`) REFERENCES \`media\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `product_images`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `product_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `products`");
}
