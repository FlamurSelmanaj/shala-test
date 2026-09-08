import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Admin } from "./admin.model.ts";

export class Media extends Model<InferAttributes<Media>, InferCreationAttributes<Media>> {
  declare id: CreationOptional<number>;
  declare filename: string;
  declare originalFilename: string;
  declare url: string;
  declare mimeType: string;
  declare size: number;
  declare width: number | null;
  declare height: number | null;
  declare folder: string | null;
  declare storageProvider: CreationOptional<string>;
  declare storageKey: string | null;
  declare uploadedById: ForeignKey<Admin["id"]> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Media.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    filename: { type: DataTypes.STRING(255), allowNull: false },
    originalFilename: { type: DataTypes.STRING(255), allowNull: false },
    url: { type: DataTypes.STRING(1024), allowNull: false },
    mimeType: { type: DataTypes.STRING(127), allowNull: false },
    size: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    width: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    height: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    folder: { type: DataTypes.STRING(255), allowNull: true },
    storageProvider: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "LOCAL" },
    storageKey: { type: DataTypes.STRING(255), allowNull: true },
    uploadedById: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "media", modelName: "Media" },
);
