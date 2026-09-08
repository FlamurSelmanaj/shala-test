import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { FooterColumn } from "./footer-column.model.ts";
import { Category } from "./category.model.ts";
import { Page } from "./page.model.ts";
import { LINK_TYPES } from "../../config/constants.ts";

export class FooterLink extends Model<InferAttributes<FooterLink>, InferCreationAttributes<FooterLink>> {
  declare id: CreationOptional<number>;
  declare footerColumnId: ForeignKey<FooterColumn["id"]>;
  declare sortOrder: CreationOptional<number>;
  declare linkType: string;
  declare categoryId: ForeignKey<Category["id"]> | null;
  declare pageId: ForeignKey<Page["id"]> | null;
  declare externalUrl: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FooterLink.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    footerColumnId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    linkType: { type: DataTypes.ENUM(...LINK_TYPES), allowNull: false },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    pageId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    externalUrl: { type: DataTypes.STRING(1024), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "footer_links", modelName: "FooterLink" },
);
