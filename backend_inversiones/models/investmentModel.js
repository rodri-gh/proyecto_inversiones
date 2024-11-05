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
        projectId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        investmentDate: {
            type: DataTypes.DATE,
            //TODO: change to NOW and add allow null
            defaultValue: DataTypes.NOW
        },
        profitPercentage: {
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