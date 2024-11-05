import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class OperatingExpense extends Model {}
OperatingExpense.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expenses: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        projectId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        sequelize,
        modelName: 'operatingExpense',
        tableName: 'operating_expenses',
        timestamps: false
    }
);

export default OperatingExpense;