import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { ATTRIBUTE_TYPES } from "../../config/constants.ts";

export class Attribute extends Model<InferAttributes<Attribute>, InferCreationAttributes<Attribute>> {
  declare id: CreationOptional<number>;
  declare key: string;
  declare type: string;
  declare unit: string | null;
  declare isFilterable: CreationOptional<boolean>;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Attribute.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    type: { type: DataTypes.ENUM(...ATTRIBUTE_TYPES), allowNull: false },
    unit: { type: DataTypes.STRING(32), allowNull: true },
    isFilterable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "attributes", modelName: "Attribute" },
);
