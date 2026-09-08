import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Category } from "./category.model.ts";

export interface ProductFacetValues {
  [attributeKey: string]: string | string[] | number | boolean;
}

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare sku: string | null;
  declare slug: string;
  declare categoryId: ForeignKey<Category["id"]>;
  declare facetValues: CreationOptional<ProductFacetValues>;
  declare sortOrder: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    sku: { type: DataTypes.STRING(100), allowNull: true },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    facetValues: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "products", modelName: "Product" },
);
