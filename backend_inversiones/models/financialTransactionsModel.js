import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class FinancialTransactions extends Model {}
FinancialTransactions.init(
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
        transactionType: {
            type: DataTypes.ENUM('deposit', 'withdrawal', 'commission', 'income', 'expense'),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(20, 3),
            allowNull: false,
        },
        transactionDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('completed', 'pending', 'failed'),
            allowNull: false
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'financialTransactions',
        tableName: 'financial_transactions',
        timestamps: false
    }
);

export default FinancialTransactions;