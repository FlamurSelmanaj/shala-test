import { DataTypes, type QueryInterface } from "sequelize";

export async function up({ context }: { context: QueryInterface }): Promise<void> {
  await context.createTable("media", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    filename: { type: DataTypes.STRING(255), allowNull: false },
    original_filename: { type: DataTypes.STRING(255), allowNull: false },
    url: { type: DataTypes.STRING(1024), allowNull: false },
    mime_type: { type: DataTypes.STRING(127), allowNull: false },
    size: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    width: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    height: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    folder: { type: DataTypes.STRING(255), allowNull: true },
    storage_provider: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "LOCAL" },
    storage_key: { type: DataTypes.STRING(255), allowNull: true },
    uploaded_by_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "admins", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.createTable("asset_translations", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    asset_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "media", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    alt_text: { type: DataTypes.STRING(255), allowNull: true },
    caption: { type: DataTypes.STRING(500), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await context.addIndex("asset_translations", ["asset_id", "locale"], { unique: true });
}

export async function down({ context }: { context: QueryInterface }): Promise<void> {
  await context.dropTable("asset_translations");
  await context.dropTable("media");
}
