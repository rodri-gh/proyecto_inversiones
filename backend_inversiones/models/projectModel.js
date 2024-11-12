import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class Project extends Model {}
Project.init(
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
            type: DataTypes.TEXT,
        },
        investmentGoal: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('open', 'in_transit', 'closed'),
            allowNull: false,
            defaultValue: 'open'
        },
        startDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        endDate: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: DataTypes.NOW
        },
        projectType: {
            type: DataTypes.STRING(10, 2),
            allowNull: true
        },
        profitPercentage: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'project',
        tableName: 'projects',
        timestamps: false
    }
);

export default Project;