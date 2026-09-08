import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";

export class Page extends Model<InferAttributes<Page>, InferCreationAttributes<Page>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare template: string | null;
  declare isActive: CreationOptional<boolean>;
  declare publishedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Page.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    template: { type: DataTypes.STRING(100), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "pages", modelName: "Page" },
);
