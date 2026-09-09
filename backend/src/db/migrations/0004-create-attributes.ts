import type { QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE \`attributes\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`key\` varchar(100) NOT NULL,
      \`type\` enum('SELECT','MULTI_SELECT','BOOLEAN','NUMBER') NOT NULL,
      \`unit\` varchar(32) DEFAULT NULL,
      \`is_filterable\` tinyint(1) NOT NULL DEFAULT '1',
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`key\` (\`key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`attribute_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`attribute_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`label\` varchar(255) NOT NULL,
      \`help_text\` varchar(500) DEFAULT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`attribute_translations_attribute_id_locale\` (\`attribute_id\`,\`locale\`),
      CONSTRAINT \`attribute_translations_ibfk_1\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`attributes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`attribute_options\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`attribute_id\` int unsigned NOT NULL,
      \`value\` varchar(100) NOT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`attribute_options_attribute_id_value\` (\`attribute_id\`,\`value\`),
      CONSTRAINT \`attribute_options_ibfk_1\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`attributes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`attribute_option_translations\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`option_id\` int unsigned NOT NULL,
      \`locale\` varchar(5) NOT NULL,
      \`label\` varchar(255) NOT NULL,
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`attribute_option_translations_option_id_locale\` (\`option_id\`,\`locale\`),
      CONSTRAINT \`attribute_option_translations_ibfk_1\` FOREIGN KEY (\`option_id\`) REFERENCES \`attribute_options\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE \`category_attributes\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT,
      \`category_id\` int unsigned NOT NULL,
      \`attribute_id\` int unsigned NOT NULL,
      \`sort_order\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime NOT NULL,
      \`updated_at\` datetime NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`category_attributes_category_id_attribute_id\` (\`category_id\`,\`attribute_id\`),
      KEY \`attribute_id\` (\`attribute_id\`),
      CONSTRAINT \`category_attributes_ibfk_1\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`category_attributes_ibfk_2\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`attributes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `category_attributes`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `attribute_option_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `attribute_options`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `attribute_translations`");
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS `attributes`");
}
