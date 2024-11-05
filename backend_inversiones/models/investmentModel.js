import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class Investment extends Model { }
Investment.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        investment_date: {
            type: DataTypes.DATE,
            //TODO: change to NOW and add allow null
            defaultValue: DataTypes.NOW
        },
        profit_percentage: {
            type: DataTypes.DECIMAL(10, 2),
        }
    },
    {
        sequelize,
        modelName: 'investment',
        tableName: 'investments',
        timestamps: false
    }
);

export default Investment;