import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class Mineral extends Model { }
Mineral.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.DECIMAL(20, 6),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'mineral',
    tableName: 'minerals',
    timestamps: false
  }
);

export default Mineral;