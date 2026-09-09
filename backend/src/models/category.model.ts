import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db/sequelize.ts";

/** Maps onto the real, pre-existing `categories` table (migration 0003). The
 * per-language `name` lives in the sibling `category_translations` table
 * (see category-translation.model.ts) — this app treats the slug as the
 * public-facing id, matching what the frontend already sends. */
export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare icon: string | null;
}

Category.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    icon: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "categories", underscored: true },
);
