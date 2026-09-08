import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Page } from "./page.model.ts";
import { Media } from "./media.model.ts";

export class PageTranslation extends Model<InferAttributes<PageTranslation>, InferCreationAttributes<PageTranslation>> {
  declare id: CreationOptional<number>;
  declare pageId: ForeignKey<Page["id"]>;
  declare locale: string;
  declare title: string;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare ogImageId: ForeignKey<Media["id"]> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PageTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    pageId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    metaTitle: { type: DataTypes.STRING(255), allowNull: true },
    metaDescription: { type: DataTypes.STRING(500), allowNull: true },
    ogImageId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "page_translations",
    modelName: "PageTranslation",
    indexes: [{ unique: true, fields: ["page_id", "locale"] }],
  },
);
