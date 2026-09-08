import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Media } from "./media.model.ts";

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare icon: string | null;
  declare parentId: ForeignKey<Category["id"]> | null;
  declare imageId: ForeignKey<Media["id"]> | null;
  declare sortOrder: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Category.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    icon: { type: DataTypes.STRING(1024), allowNull: true },
    parentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    imageId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "categories", modelName: "Category" },
);
