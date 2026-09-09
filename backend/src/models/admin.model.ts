import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db/sequelize.ts";

/** Maps onto the real, pre-existing `admins` table (migration 0001) — not a table this
 * project created. Only the columns the auth flow needs are modeled. */
export class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare passwordHash: string;
  declare name: string;
  declare role: string;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false, field: "password_hash" },
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "ADMIN" },
  },
  { sequelize, tableName: "admins", underscored: true },
);
