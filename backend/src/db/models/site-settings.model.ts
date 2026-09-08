import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Media } from "./media.model.ts";

export interface SocialLinks {
  [platform: string]: string;
}

export class SiteSettings extends Model<InferAttributes<SiteSettings>, InferCreationAttributes<SiteSettings>> {
  declare id: CreationOptional<number>;
  declare logoMediaId: ForeignKey<Media["id"]> | null;
  declare phone: string | null;
  declare email: string | null;
  declare socialLinks: CreationOptional<SocialLinks>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SiteSettings.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    logoMediaId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    phone: { type: DataTypes.STRING(64), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: true },
    socialLinks: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "site_settings", modelName: "SiteSettings" },
);
