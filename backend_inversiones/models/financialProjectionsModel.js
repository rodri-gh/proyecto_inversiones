import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class FinancialProjections extends Model {}
FinancialProjections.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        projectId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        projectionDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        totalInvestment: {
            type: DataTypes.DECIMAL(20, 3),
            allowNull: false,
        },
        totalProfit: {
            type: DataTypes.DECIMAL(20, 3),
            allowNull: false,
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'financialProjections',
        tableName: 'financial_projections',
        timestamps: false
    }
);

export default FinancialProjections;