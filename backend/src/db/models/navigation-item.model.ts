import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Category } from "./category.model.ts";
import { Page } from "./page.model.ts";
import { LINK_TYPES } from "../../config/constants.ts";

export class NavigationItem extends Model<InferAttributes<NavigationItem>, InferCreationAttributes<NavigationItem>> {
  declare id: CreationOptional<number>;
  declare parentId: ForeignKey<NavigationItem["id"]> | null;
  declare linkType: string;
  declare categoryId: ForeignKey<Category["id"]> | null;
  declare pageId: ForeignKey<Page["id"]> | null;
  declare externalUrl: string | null;
  declare sortOrder: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
  declare openInNewTab: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

NavigationItem.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    parentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    linkType: { type: DataTypes.ENUM(...LINK_TYPES), allowNull: false },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    pageId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    externalUrl: { type: DataTypes.STRING(1024), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    openInNewTab: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "navigation_items", modelName: "NavigationItem" },
);
