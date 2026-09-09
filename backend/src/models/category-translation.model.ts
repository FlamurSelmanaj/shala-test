import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db/sequelize.ts";

export class CategoryTranslation extends Model<
  InferAttributes<CategoryTranslation>,
  InferCreationAttributes<CategoryTranslation>
> {
  declare id: CreationOptional<number>;
  declare categoryId: number;
  declare locale: string;
  declare name: string;
}

CategoryTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "category_translations", underscored: true },
);
