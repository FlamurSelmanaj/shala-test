import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Category } from "./category.model.ts";

export class CategoryTranslation extends Model<InferAttributes<CategoryTranslation>, InferCreationAttributes<CategoryTranslation>> {
  declare id: CreationOptional<number>;
  declare categoryId: ForeignKey<Category["id"]>;
  declare locale: string;
  declare name: string;
  declare description: string | null;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CategoryTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    metaTitle: { type: DataTypes.STRING(255), allowNull: true },
    metaDescription: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "category_translations",
    modelName: "CategoryTranslation",
    indexes: [{ unique: true, fields: ["category_id", "locale"] }],
  },
);
