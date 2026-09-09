import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db/sequelize.ts";

/** `shortDescription` holds what the frontend calls a product's "blurb". */
export class ProductTranslation extends Model<
  InferAttributes<ProductTranslation>,
  InferCreationAttributes<ProductTranslation>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare locale: string;
  declare name: string;
  declare shortDescription: string | null;
}

ProductTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    shortDescription: { type: DataTypes.STRING(500), allowNull: true, field: "short_description" },
  },
  { sequelize, tableName: "product_translations", underscored: true },
);
