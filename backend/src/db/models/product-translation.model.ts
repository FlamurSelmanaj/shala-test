import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { Product } from "./product.model.ts";

export class ProductTranslation extends Model<InferAttributes<ProductTranslation>, InferCreationAttributes<ProductTranslation>> {
  declare id: CreationOptional<number>;
  declare productId: ForeignKey<Product["id"]>;
  declare locale: string;
  declare name: string;
  declare shortDescription: string | null;
  declare description: string | null;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProductTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    shortDescription: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    metaTitle: { type: DataTypes.STRING(255), allowNull: true },
    metaDescription: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "product_translations",
    modelName: "ProductTranslation",
    indexes: [{ unique: true, fields: ["product_id", "locale"] }],
  },
);
