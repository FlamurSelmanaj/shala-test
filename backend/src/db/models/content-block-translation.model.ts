import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { ContentBlock } from "./content-block.model.ts";

export class ContentBlockTranslation extends Model<
  InferAttributes<ContentBlockTranslation>,
  InferCreationAttributes<ContentBlockTranslation>
> {
  declare id: CreationOptional<number>;
  declare blockId: ForeignKey<ContentBlock["id"]>;
  declare locale: string;
  declare data: CreationOptional<Record<string, unknown>>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ContentBlockTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    blockId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    data: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "content_block_translations",
    modelName: "ContentBlockTranslation",
    indexes: [{ unique: true, fields: ["block_id", "locale"] }],
  },
);
