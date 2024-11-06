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
            allowNull: false,
            //TODO: to review default value '0'
            defaultValue: '0'
        },
        contractCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contractDate: {
            type: DataTypes.DATE,
            allowNull: false,
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
