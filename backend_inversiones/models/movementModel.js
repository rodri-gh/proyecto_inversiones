import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class Movement extends Model {}
Movement.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        sequelize,
        modelName: 'movement',
        tableName: 'movements',
        timestamps: false
    }
);

export default Movement;