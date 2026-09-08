import { DataTypes, type QueryInterface } from "sequelize";

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.createTable("categories", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    icon: { type: DataTypes.STRING(1024), allowNull: true },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    image_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "media", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.createTable("category_translations", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "categories", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    meta_title: { type: DataTypes.STRING(255), allowNull: true },
    meta_description: { type: DataTypes.STRING(500), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("category_translations", ["category_id", "locale"], { unique: true });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.dropTable("category_translations");
  await context.dropTable("categories");
}
