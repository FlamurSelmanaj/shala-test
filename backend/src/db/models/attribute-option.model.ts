import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Attribute } from "./attribute.model.ts";

export class AttributeOption extends Model<InferAttributes<AttributeOption>, InferCreationAttributes<AttributeOption>> {
  declare id: CreationOptional<number>;
  declare attributeId: ForeignKey<Attribute["id"]>;
  declare value: string;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AttributeOption.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    attributeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    value: { type: DataTypes.STRING(100), allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "attribute_options",
    modelName: "AttributeOption",
    indexes: [{ unique: true, fields: ["attribute_id", "value"] }],
  },
);
