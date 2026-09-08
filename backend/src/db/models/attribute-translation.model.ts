import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Attribute } from "./attribute.model.ts";

export class AttributeTranslation extends Model<InferAttributes<AttributeTranslation>, InferCreationAttributes<AttributeTranslation>> {
  declare id: CreationOptional<number>;
  declare attributeId: ForeignKey<Attribute["id"]>;
  declare locale: string;
  declare label: string;
  declare helpText: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AttributeTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    attributeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: false },
    helpText: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "attribute_translations",
    modelName: "AttributeTranslation",
    indexes: [{ unique: true, fields: ["attribute_id", "locale"] }],
  },
);
