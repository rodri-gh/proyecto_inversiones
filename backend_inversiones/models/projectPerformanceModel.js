import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class ProjectPerformance extends Model {}
ProjectPerformance.init(
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
        profitDate: {
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
        modelName: 'projectPerformance',
        tableName: 'project_performance',
        timestamps: false
    }
);

export default ProjectPerformance;