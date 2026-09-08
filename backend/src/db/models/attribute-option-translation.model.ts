import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { AttributeOption } from "./attribute-option.model.ts";

export class AttributeOptionTranslation extends Model<
  InferAttributes<AttributeOptionTranslation>,
  InferCreationAttributes<AttributeOptionTranslation>
> {
  declare id: CreationOptional<number>;
  declare optionId: ForeignKey<AttributeOption["id"]>;
  declare locale: string;
  declare label: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AttributeOptionTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    optionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "attribute_option_translations",
    modelName: "AttributeOptionTranslation",
    indexes: [{ unique: true, fields: ["option_id", "locale"] }],
  },
);
