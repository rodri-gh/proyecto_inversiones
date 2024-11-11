import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class FinancialSettings extends Model {}
FinancialSettings.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        settingName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.DECIMAL(10, 3),
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
        modelName: 'financialSettings',
        tableName: 'financial_settings',
        timestamps: false
    }
);

export default FinancialSettings;