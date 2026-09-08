import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { SiteSettings } from "./site-settings.model.ts";

export class SiteSettingsTranslation extends Model<
  InferAttributes<SiteSettingsTranslation>,
  InferCreationAttributes<SiteSettingsTranslation>
> {
  declare id: CreationOptional<number>;
  declare siteSettingsId: ForeignKey<SiteSettings["id"]>;
  declare locale: string;
  declare tagline: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SiteSettingsTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    siteSettingsId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    tagline: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "site_settings_translations",
    modelName: "SiteSettingsTranslation",
    indexes: [{ unique: true, fields: ["site_settings_id", "locale"] }],
  },
);
