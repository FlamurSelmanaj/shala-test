import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Media } from "./media.model.ts";

export class AssetTranslation extends Model<InferAttributes<AssetTranslation>, InferCreationAttributes<AssetTranslation>> {
  declare id: CreationOptional<number>;
  declare assetId: ForeignKey<Media["id"]>;
  declare locale: string;
  declare altText: string | null;
  declare caption: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AssetTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    assetId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    altText: { type: DataTypes.STRING(255), allowNull: true },
    caption: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "asset_translations",
    modelName: "AssetTranslation",
    indexes: [{ unique: true, fields: ["asset_id", "locale"] }],
  },
);
