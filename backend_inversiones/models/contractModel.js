import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class Contract extends Model { }
Contract.init(
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
            allowNull: false
        },
        investmentId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            //TODO: to review default value '0'
        },
        investmentAmount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        contractCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'finalized'),
            allowNull: false,
            defaultValue: 'active'
        },
        contractType: {
            type: DataTypes.ENUM('fixed_rate', 'variable_rate'),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'USD'
        },
        contractFilePath: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        modelName: 'contract',
        tableName: 'contracts',
        timestamps: false
    }
);

export default Contract;
