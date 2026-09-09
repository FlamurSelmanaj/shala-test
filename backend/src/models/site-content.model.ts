import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db/sequelize.ts";

/** Companion table (migration 0011), singleton row (id always 1) — site chrome
 * (`content`), language config (`meta`), and the edit-only page shell records
 * (`pages`) that the real `pages` table doesn't model. */
export class SiteContent extends Model<InferAttributes<SiteContent>, InferCreationAttributes<SiteContent>> {
  declare id: CreationOptional<number>;
  declare content: Record<string, unknown>;
  declare meta: Record<string, unknown>;
  declare pages: unknown[];
}

SiteContent.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
    content: { type: DataTypes.JSON, allowNull: false },
    meta: { type: DataTypes.JSON, allowNull: false },
    pages: { type: DataTypes.JSON, allowNull: false },
  },
  { sequelize, tableName: "site_content", underscored: true },
);
