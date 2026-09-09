import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db/sequelize.ts";

/** Maps onto the real, pre-existing `products` table (migration 0005). `facetValues`
 * is a real NOT NULL column this app doesn't use — defaulted to `{}` on create.
 * Name/blurb live in the sibling `product_translations` table. */
export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare categoryId: number;
  declare facetValues: CreationOptional<Record<string, unknown>>;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    facetValues: { type: DataTypes.JSON, allowNull: false, defaultValue: {}, field: "facet_values" },
  },
  { sequelize, tableName: "products", underscored: true },
);
