import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db/sequelize.ts";

/** Companion table (migration 0010) — flat locale -> {key: string} UI-copy dictionary. */
export class Translation extends Model<InferAttributes<Translation>, InferCreationAttributes<Translation>> {
  declare lang: string;
  declare data: Record<string, string>;
}

Translation.init(
  {
    lang: { type: DataTypes.STRING(5), primaryKey: true },
    data: { type: DataTypes.JSON, allowNull: false },
  },
  { sequelize, tableName: "translations", underscored: true },
);
