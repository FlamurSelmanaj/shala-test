import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { FooterColumn } from "./footer-column.model.ts";

export class FooterColumnTranslation extends Model<
  InferAttributes<FooterColumnTranslation>,
  InferCreationAttributes<FooterColumnTranslation>
> {
  declare id: CreationOptional<number>;
  declare footerColumnId: ForeignKey<FooterColumn["id"]>;
  declare locale: string;
  declare title: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FooterColumnTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    footerColumnId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "footer_column_translations",
    modelName: "FooterColumnTranslation",
    indexes: [{ unique: true, fields: ["footer_column_id", "locale"] }],
  },
);
