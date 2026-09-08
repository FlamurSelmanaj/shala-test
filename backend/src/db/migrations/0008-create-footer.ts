import { DataTypes, type QueryInterface } from "sequelize";
import { LINK_TYPES } from "../../config/constants.ts";

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.createTable("footer_columns", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.createTable("footer_column_translations", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    footer_column_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "footer_columns", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("footer_column_translations", ["footer_column_id", "locale"], { unique: true });

  await context.createTable("footer_links", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    footer_column_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "footer_columns", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    link_type: { type: DataTypes.ENUM(...LINK_TYPES), allowNull: false },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    page_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "pages", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    external_url: { type: DataTypes.STRING(1024), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.createTable("footer_link_translations", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    footer_link_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "footer_links", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("footer_link_translations", ["footer_link_id", "locale"], { unique: true });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.dropTable("footer_link_translations");
  await context.dropTable("footer_links");
  await context.dropTable("footer_column_translations");
  await context.dropTable("footer_columns");
}
