import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../connection.ts";
import { NavigationItem } from "./navigation-item.model.ts";

export class NavigationItemTranslation extends Model<
  InferAttributes<NavigationItemTranslation>,
  InferCreationAttributes<NavigationItemTranslation>
> {
  declare id: CreationOptional<number>;
  declare navigationItemId: ForeignKey<NavigationItem["id"]>;
  declare locale: string;
  declare label: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

NavigationItemTranslation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    navigationItemId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    locale: { type: DataTypes.STRING(5), allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "navigation_item_translations",
    modelName: "NavigationItemTranslation",
    indexes: [{ unique: true, fields: ["navigation_item_id", "locale"] }],
  },
);
