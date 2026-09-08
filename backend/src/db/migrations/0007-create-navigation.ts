import { DataTypes, type QueryInterface } from "sequelize";
import { LINK_TYPES } from "../../config/constants.ts";

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.createTable("navigation_items", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "navigation_items", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
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
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    open_in_new_tab: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.createTable("navigation_item_translations", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    navigation_item_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "navigation_items", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("navigation_item_translations", ["navigation_item_id", "locale"], { unique: true });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.dropTable("navigation_item_translations");
  await context.dropTable("navigation_items");
}
