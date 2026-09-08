import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Category } from "./category.model.ts";
import { Attribute } from "./attribute.model.ts";

export class CategoryAttribute extends Model<InferAttributes<CategoryAttribute>, InferCreationAttributes<CategoryAttribute>> {
  declare id: CreationOptional<number>;
  declare categoryId: ForeignKey<Category["id"]>;
  declare attributeId: ForeignKey<Attribute["id"]>;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CategoryAttribute.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    attributeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "category_attributes",
    modelName: "CategoryAttribute",
    indexes: [{ unique: true, fields: ["category_id", "attribute_id"] }],
  },
);
