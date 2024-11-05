import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import Project from "./projectModel.js";
import User from "./userModel.js";
import Investment from "./investmentModel.js";



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

Contract.belongsTo(Project, { foreignKey: 'projectId' });
Contract.belongsTo(User, { foreignKey: 'userId' });
Contract.belongsTo(Investment, { foreignKey: 'investmentId' });

export default Contract;