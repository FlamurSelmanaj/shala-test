import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { FooterLink } from "./footer-link.model.ts";

export class FooterLinkTranslation extends Model<
  InferAttributes<FooterLinkTranslation>,
  InferCreationAttributes<FooterLinkTranslation>
> {
  declare id: CreationOptional<number>;
  declare footerLinkId: ForeignKey<FooterLink["id"]>;
  declare locale: string;
  declare label: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FooterLinkTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    footerLinkId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "footer_link_translations",
    modelName: "FooterLinkTranslation",
    indexes: [{ unique: true, fields: ["footer_link_id", "locale"] }],
  },
);
