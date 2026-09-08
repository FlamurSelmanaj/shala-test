import { DataTypes, type QueryInterface } from "sequelize";
import { ATTRIBUTE_TYPES } from "../../config/constants.ts";

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.createTable("attributes", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    type: { type: DataTypes.ENUM(...ATTRIBUTE_TYPES), allowNull: false },
    unit: { type: DataTypes.STRING(32), allowNull: true },
    is_filterable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.createTable("attribute_translations", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    attribute_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "attributes", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: false },
    help_text: { type: DataTypes.STRING(500), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("attribute_translations", ["attribute_id", "locale"], { unique: true });

  await context.createTable("attribute_options", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    attribute_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "attributes", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    value: { type: DataTypes.STRING(100), allowNull: false },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("attribute_options", ["attribute_id", "value"], { unique: true });

  await context.createTable("attribute_option_translations", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    option_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "attribute_options", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("attribute_option_translations", ["option_id", "locale"], { unique: true });

  await context.createTable("category_attributes", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "categories", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    attribute_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "attributes", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("category_attributes", ["category_id", "attribute_id"], { unique: true });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.dropTable("category_attributes");
  await context.dropTable("attribute_option_translations");
  await context.dropTable("attribute_options");
  await context.dropTable("attribute_translations");
  await context.dropTable("attributes");
}
