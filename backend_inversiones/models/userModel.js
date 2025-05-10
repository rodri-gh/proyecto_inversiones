import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class User extends Model { }
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('super_user', 'admin', 'client'),
      allowNull: false,
      defaultValue: 'client'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: false
  }
);

export default User;